package com.educonnect.controller;

import com.educonnect.dto.request.AuditRequest;
import com.educonnect.dto.request.ComplianceRecordRequest;
import com.educonnect.service.impl.ComplianceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/compliance")
@RequiredArgsConstructor
public class ComplianceController {

    private final ComplianceService complianceService;

    @PostMapping("/records")
    @PreAuthorize("hasAnyRole('COMPLIANCE_OFFICER','SCHOOL_ADMIN')")
    public ResponseEntity<?> createRecord(@Valid @RequestBody ComplianceRecordRequest request) {
        return ResponseEntity.ok(complianceService.createComplianceRecord(request));
    }

    @GetMapping("/records")
    @PreAuthorize("hasAnyRole('COMPLIANCE_OFFICER','GOVERNMENT_AUDITOR','PROGRAM_MANAGER','SCHOOL_ADMIN')")
    public ResponseEntity<?> getAllRecords() {
        return ResponseEntity.ok(complianceService.getAllComplianceRecords());
    }

    @GetMapping("/records/type/{type}")
    public ResponseEntity<?> getRecordsByType(@PathVariable String type) {
        return ResponseEntity.ok(complianceService.getRecordsByType(type));
    }

    @GetMapping("/summary")
    public ResponseEntity<?> getSummary() {
        return ResponseEntity.ok(complianceService.getComplianceSummary());
    }

    @PostMapping("/audits/{officerId}")
    @PreAuthorize("hasAnyRole('COMPLIANCE_OFFICER','GOVERNMENT_AUDITOR')")
    public ResponseEntity<?> createAudit(@PathVariable Long officerId,
                                         @Valid @RequestBody AuditRequest request) {
        return ResponseEntity.ok(complianceService.createAudit(officerId, request));
    }

    @GetMapping("/audits")
    @PreAuthorize("hasAnyRole('COMPLIANCE_OFFICER','GOVERNMENT_AUDITOR','PROGRAM_MANAGER')")
    public ResponseEntity<?> getAllAudits() {
        return ResponseEntity.ok(complianceService.getAllAudits());
    }

    @GetMapping("/audits/officer/{officerId}")
    public ResponseEntity<?> getAuditsByOfficer(@PathVariable Long officerId) {
        return ResponseEntity.ok(complianceService.getAuditsByOfficer(officerId));
    }

    @PutMapping("/audits/{auditId}/status")
    @PreAuthorize("hasAnyRole('COMPLIANCE_OFFICER','GOVERNMENT_AUDITOR')")
    public ResponseEntity<?> updateAuditStatus(@PathVariable Long auditId,
                                               @RequestParam String status) {
        return ResponseEntity.ok(complianceService.updateAuditStatus(auditId, status));
    }
}
