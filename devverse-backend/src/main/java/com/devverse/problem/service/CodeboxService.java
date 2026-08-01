package com.devverse.problem.service;

import com.devverse.problem.dto.CodeboxResponseDTO;
import com.devverse.problem.dto.CodeboxStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.HttpHeaders;

import java.util.Map;
import java.util.HashMap;
import java.util.List;
import java.util.ArrayList;

@Service
@RequiredArgsConstructor
public class CodeboxService {

    @Value("${CODEBOX_API_URL}")
    private String codeboxUrl;

    // @Value("${codebox.api.key}")
    private String codeboxApiKey = "dev-token";

    private final RestTemplate restTemplate;

    public CodeboxResponseDTO executeCode(String code, int languageId, String stdin, String expectedOutput) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("X-Auth-Token", codeboxApiKey);

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("source_code", code);
        requestBody.put("language_id", languageId);
        requestBody.put("stdin", stdin);
        if (expectedOutput != null) {
            requestBody.put("expected_output", expectedOutput);
        }

        HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(requestBody, headers);

        String url = codeboxUrl + "/submissions?wait=true";
        try {
            return restTemplate.postForObject(url, requestEntity, CodeboxResponseDTO.class);
        } catch (Exception e) {
            CodeboxResponseDTO errorResponse = new CodeboxResponseDTO();
            errorResponse.setStatus(new com.devverse.problem.dto.CodeboxStatus(13, "Internal Error"));
            errorResponse.setStderr("Codebox API failed: " + e.getMessage());
            return errorResponse;
        }
    }

    public List<CodeboxResponseDTO> executeCodeBatch(List<Map<String, Object>> submissions) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("X-Auth-Token", codeboxApiKey);

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("submissions", submissions);

        HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(requestBody, headers);
        String url = codeboxUrl + "/submissions/batch";

        try {
            List<Map<String, String>> tokensList = restTemplate.postForObject(url, requestEntity, List.class);
            if (tokensList == null || tokensList.isEmpty()) {
                throw new RuntimeException("No tokens returned from Codebox API");
            }

            StringBuilder tokensBuilder = new StringBuilder();
            for (Map<String, String> tokenMap : tokensList) {
                if (tokensBuilder.length() > 0)
                    tokensBuilder.append(",");
                tokensBuilder.append(tokenMap.get("token"));
            }
            String tokens = tokensBuilder.toString();

            String pollUrl = codeboxUrl + "/submissions/batch?tokens=" + tokens;
            HttpEntity<Void> pollEntity = new HttpEntity<>(headers);

            while (true) {
                Map<String, List<CodeboxResponseDTO>> result = restTemplate.exchange(
                        pollUrl,
                        HttpMethod.GET,
                        pollEntity,
                        new ParameterizedTypeReference<Map<String, List<CodeboxResponseDTO>>>() {
                        }).getBody();

                if (result == null || !result.containsKey("submissions")) {
                    throw new RuntimeException("Invalid response during polling");
                }

                List<CodeboxResponseDTO> responses = result.get("submissions");
                boolean allDone = true;
                for (CodeboxResponseDTO res : responses) {
                    if (res.getStatus() == null || res.getStatus().getId() < 3) {
                        allDone = false;
                        break;
                    }
                }

                if (allDone) {
                    return responses;
                }

                Thread.sleep(1000);
            }
        } catch (Exception e) {
            List<CodeboxResponseDTO> errors = new ArrayList<>();
            for (int i = 0; i < submissions.size(); i++) {
                CodeboxResponseDTO err = new CodeboxResponseDTO();
                err.setStatus(new CodeboxStatus(13, "Internal Error"));
                err.setStderr("Batch execution failed: " + e.getMessage());
                errors.add(err);
            }
            return errors;
        }
    }
}
