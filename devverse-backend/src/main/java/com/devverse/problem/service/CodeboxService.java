package com.devverse.problem.service;

import com.devverse.problem.dto.CodeboxResponseDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.HttpHeaders;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class CodeboxService {

    @Value("${CODEBOX_API_URL}")
    private String codeboxUrl;

//    @Value("${codebox.api.key}")
    private String codeboxApiKey = "dev-token";

    private final RestTemplate restTemplate;

    public CodeboxResponseDTO executeCode(String code, int languageId, String stdin) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("X-Auth-Token", codeboxApiKey);

        java.util.Map<String, Object> requestBody = new java.util.HashMap<>();
        requestBody.put("source_code", code);
        requestBody.put("language_id", languageId);
        requestBody.put("stdin", stdin);

        HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(requestBody, headers);

        String url = codeboxUrl + "/submissions?wait=true";
        return restTemplate.postForObject(url, requestEntity, CodeboxResponseDTO.class);
    }
}
