package com.devverse.problem.service;

import com.devverse.problem.dto.TagsDTO;
import com.devverse.problem.repo.ProblemRepo;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import com.devverse.problem.repo.TagRepo;
import com.devverse.problem.model.Tag;
import com.devverse.problem.model.Problem;
import org.modelmapper.ModelMapper;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TagsService {

    private final TagRepo tagsRepo;
    private final ProblemRepo problemsRepo;
    private final ModelMapper modelMapper;
    
    @Transactional
    public TagsDTO createTag(TagsDTO tagsDTO) {
        if (tagsRepo.findByName(tagsDTO.getName()).isPresent()) {
            throw new IllegalArgumentException("Tag with name " + tagsDTO.getName() + " already exists");
        }
        Tag tag = modelMapper.map(tagsDTO, Tag.class);
        Tag savedTag = tagsRepo.save(tag);
        return modelMapper.map(savedTag, TagsDTO.class);
    }

    @Transactional
    public TagsDTO updateTag(Long id, TagsDTO tagsDTO) {
        Tag tag = tagsRepo.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Tag with id " + id + " not found"));
        
        if (tagsDTO.getName() != null) {
            tag.setName(tagsDTO.getName());
        }
        Tag updatedTag = tagsRepo.save(tag);
        return modelMapper.map(updatedTag, TagsDTO.class);
    }

    @Transactional
    public void deleteTag(Long id) {
        Tag tag = tagsRepo.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Tag with id " + id + " not found"));
        
        List<Problem> problems = problemsRepo.findByTags(tag);
        for (Problem problem : problems) {
            problem.getTags().remove(tag);
            problemsRepo.save(problem);
        }

        tagsRepo.delete(tag);
    }

    @Transactional
    public void updateProblemTag(Long problemId, Long tagId) {
        Problem problem = problemsRepo.findById(problemId)
                .orElseThrow(() -> new IllegalArgumentException("Problem with id " + problemId + " not found"));
        Tag tag = tagsRepo.findById(tagId)
                .orElseThrow(() -> new IllegalArgumentException("Tag with id " + tagId + " not found"));

        if (!problem.getTags().contains(tag)) {
            problem.getTags().add(tag);
            problemsRepo.save(problem);
        }
    }

    @Transactional
    public void deleteProblemTag(Long problemId, Long tagId) {
        Problem problem = problemsRepo.findById(problemId)
                .orElseThrow(() -> new IllegalArgumentException("Problem with id " + problemId + " not found"));
        Tag tag = tagsRepo.findById(tagId)
                .orElseThrow(() -> new IllegalArgumentException("Tag with id " + tagId + " not found"));

        if (problem.getTags().contains(tag)) {
            problem.getTags().remove(tag);
            problemsRepo.save(problem);
        }
    }

    public List<TagsDTO> getAllTags() {
        return tagsRepo.findAll().stream()
                .map(tag -> {
                    TagsDTO dto = modelMapper.map(tag, TagsDTO.class);
                    dto.setProblemCount(problemsRepo.countByTags(tag));
                    return dto;
                })
                .collect(Collectors.toList());
    }

    public TagsDTO getTagById(Long id) {
        Tag tag = tagsRepo.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Tag with id " + id + " not found"));
        TagsDTO dto = modelMapper.map(tag, TagsDTO.class);
        dto.setProblemCount(problemsRepo.countByTags(tag));
        return dto;
    }
}
