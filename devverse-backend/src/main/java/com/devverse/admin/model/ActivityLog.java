package com.devverse.admin.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "activity_log")
public class ActivityLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String action;
    private String entityType;
    private Long entityId;

    private Long performedBy;

    private String severity;     // "INFO", "WARNING", "CRITICAL"

    private String colorDot;

    @CreationTimestamp
    private Instant createdAt;
}
