window.FRN_DATA = {
    currentAssignee: 'Marcus Johnson',
    processSettings: {
        stages: [
            { stageNumber: 1, name: 'Stage 1 - Initial Review', expectedDuration: '3 Business Days', approver: 'Stage 1 Approver' },
            { stageNumber: 2, name: 'Stage 2 - Legal Review', expectedDuration: '4 Business Days', approver: 'Stage 2 Approver' },
            { stageNumber: 3, name: 'Stage 3 - Technical Review', expectedDuration: '5 Business Days', approver: 'Stage 3 Approver' },
            { stageNumber: 4, name: 'Stage 4 - Policy Review', expectedDuration: '3 Business Days', approver: 'Stage 4 Approver' },
            { stageNumber: 5, name: 'Stage 5 - Final QA', expectedDuration: '2 Business Days', approver: 'Stage 5 Approver' },
            { stageNumber: 6, name: 'Stage 6 - Official Signer', expectedDuration: '2 Business Days', approver: 'Stage 6 Approver' },
            { stageNumber: 7, name: 'Stage 7 - Final Review', expectedDuration: '1 Business Day', approver: 'Stage 7 Approver' }
        ]
    },
    teamGroups: [
        {
            name: 'Intake Routing Pool',
            type: 'Primary Approver Group',
            summary: 'General intake and first-pass package review.',
            purpose: 'Primary review queue for initial workflow entry.',
            members: ['Marcus Johnson', 'Lisa Anderson', 'Emily Thompson'],
            assignedStage: 'Stage 1 Approver'
        },
        {
            name: 'Legal Review Council',
            type: 'Primary Approver Group',
            summary: 'Legal and statutory review coverage.',
            purpose: 'Used for formal legal sufficiency and compliance review.',
            members: ['David Park', 'Rachel Kim', 'Karen Lee'],
            assignedStage: 'Stage 2 Approver'
        },
        {
            name: 'Technical Core Reviewers',
            type: 'Primary Approver Group',
            summary: 'Scientific and technical assessment team.',
            purpose: 'Primary technical reviewers for complex FRN packages.',
            members: ['Dr. Sarah Chen', 'Dr. Robert Martinez', 'Emily Thompson', 'Marcus Johnson'],
            assignedStage: 'Stage 3 Approver'
        },
        {
            name: 'Policy Coordination Team',
            type: 'Primary Approver Group',
            summary: 'Policy, records, and executive prep support.',
            purpose: 'Coordinates policy review and executive-ready package shaping.',
            members: ['Jennifer Martinez', 'Megan Foster', 'Allison Smith'],
            assignedStage: 'Stage 4 Approver'
        }
    ],
    documents: [
        {
            id: 'FRN-2026-1001',
            title: 'Chemical Substance Risk Assessment - Comprehensive Safety Evaluation',
            type: 'rule',
            typeLabel: 'Proposed Rule',
            office: 'Chemical Safety',
            officeCode: 'oppt',
            status: 'active',
            statusLabel: 'Active',
            currentStage: 'Stage 3 - Technical Review',
            stageNumber: 3,
            assignee: 'Dr. Sarah Chen',
            submittedBy: 'M. Torres',
            submittedDate: '2026-03-01',
            lastUpdated: '2026-03-24',
            dueDate: '2026-03-24',
            currentVersion: 'v2.1',
            completedDate: null,
            reviewCompletionDays: null,
            attachments: [
                { icon: '📄', name: 'Primary_Document_v2.1.pdf', size: '2.4 MB' },
                { icon: '📊', name: 'Risk_Assessment_Data.xlsx', size: '1.8 MB' },
                { icon: '📋', name: 'Regulatory_Analysis.docx', size: '456 KB' }
            ],
            versions: [
                { number: 'Version 2.1', meta: 'Updated Mar 24, 2026 • Stage 3 - Technical Review' },
                { number: 'Version 2.0', meta: 'Updated Mar 19, 2026 • Stage 2 - Legal Review Completed' },
                { number: 'Version 1.0', meta: 'Submitted Mar 1, 2026 • Initial Submission' }
            ]
        },
        {
            id: 'FRN-2026-1002',
            title: 'Water Quality Standards Update - National Drinking Water Regulations',
            type: 'final',
            typeLabel: 'Final Rule',
            office: 'Water',
            officeCode: 'ow',
            status: 'pending',
            statusLabel: 'Pending',
            currentStage: 'Stage 5 - Director Review',
            stageNumber: 5,
            assignee: 'Marcus Johnson',
            submittedBy: 'L. Anderson',
            submittedDate: '2026-02-28',
            lastUpdated: '2026-03-25',
            dueDate: '2026-03-27',
            currentVersion: 'v3.0',
            completedDate: null,
            reviewCompletionDays: null,
            attachments: [
                { icon: '📄', name: 'Primary_Document_v3.0.pdf', size: '3.1 MB' },
                { icon: '💧', name: 'Water_Quality_Testing_Data.xlsx', size: '2.7 MB' },
                { icon: '🗺️', name: 'Geographic_Coverage_Map.pdf', size: '1.5 MB' }
            ],
            versions: [
                { number: 'Version 3.0', meta: 'Updated Mar 25, 2026 • Stage 5 - Director Review' },
                { number: 'Version 2.0', meta: 'Updated Mar 18, 2026 • Stage 4 - Policy Review Completed' },
                { number: 'Version 1.0', meta: 'Submitted Feb 28, 2026 • Initial Submission' }
            ]
        },
        {
            id: 'FRN-2026-1003',
            title: 'Air Quality Monitoring Protocol - Regional Implementation Guidelines',
            type: 'guidance',
            typeLabel: 'Guidance',
            office: 'Air & Radiation',
            officeCode: 'oar',
            status: 'completed',
            statusLabel: 'Published',
            currentStage: 'Published',
            stageNumber: 7,
            assignee: 'David Park',
            submittedBy: 'D. Park',
            submittedDate: '2026-02-10',
            lastUpdated: '2026-03-12',
            dueDate: '2026-03-15',
            currentVersion: 'v2.4',
            completedDate: '2026-03-13',
            reviewCompletionDays: 32,
            attachments: [
                { icon: '📄', name: 'Final_Published_Document.pdf', size: '2.8 MB' },
                { icon: '🌫️', name: 'Air_Quality_Monitoring_Data.xlsx', size: '3.4 MB' },
                { icon: '📸', name: 'Monitoring_Station_Photos.zip', size: '12.3 MB' }
            ],
            versions: [
                { number: 'Version 2.4', meta: 'Published Mar 13, 2026 • Approved & Published' },
                { number: 'Version 2.0', meta: 'Updated Mar 5, 2026 • Stage 6 - Final Review' },
                { number: 'Version 1.0', meta: 'Submitted Feb 10, 2026 • Initial Submission' }
            ]
        },
        {
            id: 'FRN-2026-1004',
            title: 'Hazardous Waste Disposal Guidelines - Interstate Transport Update',
            type: 'notice',
            typeLabel: 'Notice',
            office: 'Land & Emergency',
            officeCode: 'olem',
            status: 'active',
            statusLabel: 'Active',
            currentStage: 'Stage 4 - Policy Review',
            stageNumber: 4,
            assignee: 'Jennifer Martinez',
            submittedBy: 'J. Martinez',
            submittedDate: '2026-03-04',
            lastUpdated: '2026-03-23',
            dueDate: '2026-03-21',
            currentVersion: 'v2.0',
            completedDate: null,
            reviewCompletionDays: null,
            attachments: [
                { icon: '📄', name: 'Policy_Draft_v2.0.pdf', size: '2.0 MB' },
                { icon: '🚛', name: 'Transport_Risk_Scenarios.xlsx', size: '1.2 MB' },
                { icon: '📋', name: 'Interstate_Requirements.docx', size: '534 KB' }
            ],
            versions: [
                { number: 'Version 2.0', meta: 'Updated Mar 23, 2026 • Stage 4 - Policy Review' },
                { number: 'Version 1.4', meta: 'Updated Mar 16, 2026 • Stage 3 - Technical Review Completed' },
                { number: 'Version 1.0', meta: 'Submitted Mar 4, 2026 • Initial Submission' }
            ]
        },
        {
            id: 'FRN-2026-1005',
            title: 'Pesticide Registration Standards - Pollinator Protection Revision',
            type: 'rule',
            typeLabel: 'Proposed Rule',
            office: 'Chemical Safety',
            officeCode: 'oppt',
            status: 'pending',
            statusLabel: 'Pending',
            currentStage: 'Stage 7 - Official Signer',
            stageNumber: 7,
            assignee: 'Administrator',
            submittedBy: 'K. Lee',
            submittedDate: '2026-02-20',
            lastUpdated: '2026-03-22',
            dueDate: '2026-03-29',
            currentVersion: 'v4.1',
            completedDate: null,
            reviewCompletionDays: null,
            attachments: [
                { icon: '📄', name: 'Signer_Packet_v4.1.pdf', size: '4.0 MB' },
                { icon: '🐝', name: 'Pollinator_Impact_Assessment.pdf', size: '1.7 MB' },
                { icon: '📊', name: 'Cost_Benefit_Model.xlsx', size: '2.2 MB' }
            ],
            versions: [
                { number: 'Version 4.1', meta: 'Updated Mar 22, 2026 • Stage 7 - Official Signer' },
                { number: 'Version 4.0', meta: 'Updated Mar 18, 2026 • Stage 6 - Final Review Completed' },
                { number: 'Version 1.0', meta: 'Submitted Feb 20, 2026 • Initial Submission' }
            ]
        },
        {
            id: 'FRN-2026-1006',
            title: 'Clean Water Grant Renewals - Rural Utility Formula Updates',
            type: 'notice',
            typeLabel: 'Notice',
            office: 'Water',
            officeCode: 'ow',
            status: 'completed',
            statusLabel: 'Published',
            currentStage: 'Published',
            stageNumber: 7,
            assignee: 'Emily Thompson',
            submittedBy: 'S. Patel',
            submittedDate: '2026-02-14',
            lastUpdated: '2026-03-20',
            dueDate: '2026-03-22',
            currentVersion: 'v3.2',
            completedDate: '2026-03-19',
            reviewCompletionDays: 34,
            attachments: [
                { icon: '📄', name: 'Grant_Renewal_Notice.pdf', size: '2.2 MB' },
                { icon: '💵', name: 'Funding_Formula_Workbook.xlsx', size: '1.3 MB' },
                { icon: '🧾', name: 'Stakeholder_Comment_Summary.pdf', size: '904 KB' }
            ],
            versions: [
                { number: 'Version 3.2', meta: 'Published Mar 19, 2026 • Approved & Published' },
                { number: 'Version 3.0', meta: 'Updated Mar 14, 2026 • Stage 6 - Final Review' },
                { number: 'Version 1.0', meta: 'Submitted Feb 14, 2026 • Initial Submission' }
            ]
        },
        {
            id: 'FRN-2026-1007',
            title: 'Coastal Impact Review - Floodplain Resilience Supplement',
            type: 'guidance',
            typeLabel: 'Guidance',
            office: 'Water',
            officeCode: 'ow',
            status: 'active',
            statusLabel: 'Active',
            currentStage: 'Stage 2 - Legal Review',
            stageNumber: 2,
            assignee: 'Karen Lee',
            submittedBy: 'N. Brooks',
            submittedDate: '2026-03-12',
            lastUpdated: '2026-03-21',
            dueDate: '2026-03-28',
            currentVersion: 'v1.4',
            completedDate: null,
            reviewCompletionDays: null,
            attachments: [
                { icon: '📄', name: 'Coastal_Impact_Supplement.pdf', size: '2.6 MB' },
                { icon: '🌊', name: 'Floodplain_Modeling_Data.csv', size: '840 KB' },
                { icon: '🗺️', name: 'Regional_Impact_Map.pdf', size: '1.1 MB' }
            ],
            versions: [
                { number: 'Version 1.4', meta: 'Updated Mar 21, 2026 • Stage 2 - Legal Review' },
                { number: 'Version 1.2', meta: 'Updated Mar 17, 2026 • Stage 1 - Intake Completed' },
                { number: 'Version 1.0', meta: 'Submitted Mar 12, 2026 • Initial Submission' }
            ]
        },
        {
            id: 'FRN-2026-1008',
            title: 'Industrial Emissions Revision - Hazard Threshold Adjustments',
            type: 'rule',
            typeLabel: 'Proposed Rule',
            office: 'Air & Radiation',
            officeCode: 'oar',
            status: 'active',
            statusLabel: 'Active',
            currentStage: 'Stage 1 - Intake',
            stageNumber: 1,
            assignee: 'Marcus Johnson',
            submittedBy: 'R. Diaz',
            submittedDate: '2026-03-18',
            lastUpdated: '2026-03-26',
            dueDate: '2026-04-01',
            currentVersion: 'v1.0',
            completedDate: null,
            reviewCompletionDays: null,
            attachments: [
                { icon: '📄', name: 'Industrial_Emissions_Draft.pdf', size: '2.9 MB' },
                { icon: '🏭', name: 'Facility_Inventory.xlsx', size: '1.6 MB' },
                { icon: '📈', name: 'Threshold_Modeling.pdf', size: '1.0 MB' }
            ],
            versions: [
                { number: 'Version 1.0', meta: 'Updated Mar 26, 2026 • Stage 1 - Intake' }
            ]
        },
        {
            id: 'FRN-2026-1009',
            title: 'Brownfields Redevelopment Guidance - Community Grant Notice',
            type: 'notice',
            typeLabel: 'Notice',
            office: 'Land & Emergency',
            officeCode: 'olem',
            status: 'completed',
            statusLabel: 'Published',
            currentStage: 'Published',
            stageNumber: 7,
            assignee: 'Allison Smith',
            submittedBy: 'A. Smith',
            submittedDate: '2026-01-30',
            lastUpdated: '2026-03-08',
            dueDate: '2026-03-10',
            currentVersion: 'v2.8',
            completedDate: '2026-03-09',
            reviewCompletionDays: 39,
            attachments: [
                { icon: '📄', name: 'Brownfields_Grant_Notice.pdf', size: '2.5 MB' },
                { icon: '🏘️', name: 'Community_Eligibility_Guide.docx', size: '612 KB' },
                { icon: '📊', name: 'Funding_Distribution_Tables.xlsx', size: '1.4 MB' }
            ],
            versions: [
                { number: 'Version 2.8', meta: 'Published Mar 9, 2026 • Approved & Published' },
                { number: 'Version 2.0', meta: 'Updated Mar 2, 2026 • Stage 6 - Final Review' },
                { number: 'Version 1.0', meta: 'Submitted Jan 30, 2026 • Initial Submission' }
            ]
        },
        {
            id: 'FRN-2026-1010',
            title: 'Lead Service Line Replacement Notice - State Funding Coordination',
            type: 'notice',
            typeLabel: 'Notice',
            office: 'Water',
            officeCode: 'ow',
            status: 'pending',
            statusLabel: 'Pending',
            currentStage: 'Stage 6 - Final Review',
            stageNumber: 6,
            assignee: 'Marcus Johnson',
            submittedBy: 'C. Gomez',
            submittedDate: '2026-03-05',
            lastUpdated: '2026-03-24',
            dueDate: '2026-04-02',
            currentVersion: 'v2.6',
            completedDate: null,
            reviewCompletionDays: null,
            attachments: [
                { icon: '📄', name: 'Lead_Service_Line_Notice.pdf', size: '2.1 MB' },
                { icon: '🔧', name: 'Replacement_Program_Timeline.xlsx', size: '1.1 MB' },
                { icon: '🧾', name: 'Funding_Coordination_Memo.pdf', size: '778 KB' }
            ],
            versions: [
                { number: 'Version 2.6', meta: 'Updated Mar 24, 2026 • Stage 6 - Final Review' },
                { number: 'Version 2.0', meta: 'Updated Mar 18, 2026 • Stage 5 - Director Review Completed' },
                { number: 'Version 1.0', meta: 'Submitted Mar 5, 2026 • Initial Submission' }
            ]
        },
        {
            id: 'FRN-2026-1011',
            title: 'TSCA Reporting Threshold Revision - Small Business Flexibility Review',
            type: 'rule',
            typeLabel: 'Proposed Rule',
            office: 'Chemical Safety',
            officeCode: 'oppt',
            status: 'active',
            statusLabel: 'Active',
            currentStage: 'Stage 5 - Director Review',
            stageNumber: 5,
            assignee: 'Allison Smith',
            submittedBy: 'B. Nguyen',
            submittedDate: '2026-03-02',
            lastUpdated: '2026-03-20',
            dueDate: '2026-03-25',
            currentVersion: 'v2.9',
            completedDate: null,
            reviewCompletionDays: null,
            attachments: [
                { icon: '📄', name: 'TSCA_Threshold_Revision.pdf', size: '3.0 MB' },
                { icon: '🏢', name: 'Small_Business_Impact_Assessment.xlsx', size: '1.9 MB' },
                { icon: '📋', name: 'Reviewer_Response_Log.docx', size: '508 KB' }
            ],
            versions: [
                { number: 'Version 2.9', meta: 'Updated Mar 20, 2026 • Stage 5 - Director Review' },
                { number: 'Version 2.4', meta: 'Updated Mar 15, 2026 • Stage 4 - Policy Review Completed' },
                { number: 'Version 1.0', meta: 'Submitted Mar 2, 2026 • Initial Submission' }
            ]
        },
        {
            id: 'FRN-2026-1012',
            title: 'Methane Monitoring Update - Oil and Gas Reporting Clarification',
            type: 'final',
            typeLabel: 'Final Rule',
            office: 'Air & Radiation',
            officeCode: 'oar',
            status: 'completed',
            statusLabel: 'Published',
            currentStage: 'Published',
            stageNumber: 7,
            assignee: 'Emily Thompson',
            submittedBy: 'T. Wilson',
            submittedDate: '2026-02-05',
            lastUpdated: '2026-03-16',
            dueDate: '2026-03-18',
            currentVersion: 'v3.5',
            completedDate: '2026-03-17',
            reviewCompletionDays: 41,
            attachments: [
                { icon: '📄', name: 'Methane_Monitoring_Final_Rule.pdf', size: '3.4 MB' },
                { icon: '⛽', name: 'Operator_Reporting_Examples.pdf', size: '1.2 MB' },
                { icon: '📊', name: 'Emissions_Baseline_Analysis.xlsx', size: '2.0 MB' }
            ],
            versions: [
                { number: 'Version 3.5', meta: 'Published Mar 17, 2026 • Approved & Published' },
                { number: 'Version 3.0', meta: 'Updated Mar 10, 2026 • Stage 6 - Final Review' },
                { number: 'Version 1.0', meta: 'Submitted Feb 5, 2026 • Initial Submission' }
            ]
        }
    ]
};

(() => {
    const CUSTOM_DOCUMENTS_KEY = 'frn_custom_documents';
    const DOCUMENT_OVERRIDES_KEY = 'frn_document_overrides';
    const officeProfiles = {
        oppt: {
            legalPointOfContact: 'Rachel Kim',
            policyLead: 'Marcus Johnson',
            statutoryAuthority: '15 U.S.C. 2601 et seq.',
            cfrCitation: '40 CFR Part 720',
            rinPrefix: '2070',
            docketPrefix: 'EPA-HQ-OPPT'
        },
        ow: {
            legalPointOfContact: 'Megan Foster',
            policyLead: 'Emily Thompson',
            statutoryAuthority: '42 U.S.C. 300f et seq.',
            cfrCitation: '40 CFR Part 141',
            rinPrefix: '2040',
            docketPrefix: 'EPA-HQ-OW'
        },
        oar: {
            legalPointOfContact: 'Daniel Ruiz',
            policyLead: 'Allison Smith',
            statutoryAuthority: '42 U.S.C. 7401 et seq.',
            cfrCitation: '40 CFR Part 60',
            rinPrefix: '2060',
            docketPrefix: 'EPA-HQ-OAR'
        },
        olem: {
            legalPointOfContact: 'Patricia Owens',
            policyLead: 'Jennifer Martinez',
            statutoryAuthority: '42 U.S.C. 6901 et seq.',
            cfrCitation: '40 CFR Part 262',
            rinPrefix: '2050',
            docketPrefix: 'EPA-HQ-OLEM'
        }
    };

    const reviewStageLabels = [
        'Stage 1 - Initial Review',
        'Stage 2 - Legal Review',
        'Stage 3 - Technical Review',
        'Stage 4 - Policy Review',
        'Stage 5 - Final QA',
        'Stage 6 - Official Signer',
        'Stage 7 - Final Review'
    ];

    const nextReviewerByStage = {
        1: 'Office of General Counsel',
        2: 'Technical Review Team',
        3: 'Policy Coordination Lead',
        4: 'Office Director',
        5: 'Quality Assurance Lead',
        6: 'Federal Register Liaison',
        7: 'Publication Team'
    };

    const priorityByStatus = {
        active: 'High',
        pending: 'Critical',
        completed: 'Standard'
    };

    const classificationByType = {
        rule: 'Regulatory Action',
        final: 'Final Agency Action',
        guidance: 'Agency Guidance',
        notice: 'Program Notice'
    };

    const categoryByType = {
        rule: 'Rulemaking',
        final: 'Final Rule',
        guidance: 'Guidance Document',
        notice: 'Public Notice'
    };

    const riskByStatus = {
        active: 'Moderate',
        pending: 'High',
        completed: 'Low'
    };

    const foiaByStatus = {
        active: 'Internal Draft',
        pending: 'Controlled Review',
        completed: 'Public Release'
    };

    const piiByType = {
        rule: 'No',
        final: 'No',
        guidance: 'No',
        notice: 'Limited'
    };

    function formatIsoDate(date) {
        return date.toISOString().slice(0, 10);
    }

    function addDays(dateText, days) {
        const date = new Date(dateText + 'T00:00:00');
        date.setDate(date.getDate() + days);
        return formatIsoDate(date);
    }

    function normalizeStageLabel(stageNumber, currentStage) {
        if (currentStage === 'Published') return 'Stage 7 - Final Review';
        return reviewStageLabels[stageNumber - 1] || currentStage;
    }

    function loadCustomDocuments() {
        try {
            const stored = window.localStorage.getItem(CUSTOM_DOCUMENTS_KEY);
            const parsed = stored ? JSON.parse(stored) : [];
            return Array.isArray(parsed) ? parsed : [];
        } catch (error) {
            console.warn('Unable to load custom FRN documents from localStorage.', error);
            return [];
        }
    }

    function loadDocumentOverrides() {
        try {
            const stored = window.localStorage.getItem(DOCUMENT_OVERRIDES_KEY);
            const parsed = stored ? JSON.parse(stored) : {};
            return parsed && typeof parsed === 'object' ? parsed : {};
        } catch (error) {
            console.warn('Unable to load FRN document overrides from localStorage.', error);
            return {};
        }
    }

    const customDocuments = loadCustomDocuments();
    if (customDocuments.length) {
        window.FRN_DATA.documents = [...window.FRN_DATA.documents, ...customDocuments];
    }

    const documentOverrides = loadDocumentOverrides();
    window.FRN_DATA.documents = window.FRN_DATA.documents.map(doc => (
        documentOverrides[doc.id]
            ? { ...doc, ...documentOverrides[doc.id] }
            : doc
    ));

    window.FRN_DATA.documents = window.FRN_DATA.documents.map((doc, index) => {
        const officeProfile = officeProfiles[doc.officeCode] || officeProfiles.oppt;
        const commentDays = doc.type === 'guidance' ? 30 : doc.type === 'notice' ? 15 : 60;
        const currentStageLabel = normalizeStageLabel(doc.stageNumber, doc.currentStage);
        const nextReviewer = doc.status === 'completed' ? 'Publication Complete' : nextReviewerByStage[Math.min(doc.stageNumber + 1, 7)];
        const nextMilestone = doc.status === 'completed' ? 'Archived for record retention' : nextReviewer;
        const commentWindowOpens = addDays(doc.submittedDate, 10 + (index % 4));
        const commentWindowCloses = addDays(commentWindowOpens, commentDays);
        const statutoryDeadline = addDays(doc.dueDate, 14 + (index % 5));
        const federalRegisterTarget = doc.completedDate || addDays(doc.dueDate, 2);
        const primaryDocument = doc.attachments[0] ? doc.attachments[0].name : 'Primary Document.pdf';
        const supportingDocuments = doc.attachments.slice(1).map(file => file.name);
        const existingStageAssignments = Array.isArray(doc.stageAssignments) ? doc.stageAssignments : [];
        const stageAssignments = reviewStageLabels.map((label, stageIndex) => {
            const existingAssignment = existingStageAssignments[stageIndex] || {};
            return {
                stage: existingAssignment.stage || label,
                owner: existingAssignment.owner || (stageIndex + 1 < doc.stageNumber ? 'Completed' : stageIndex + 1 === doc.stageNumber ? doc.assignee : nextReviewerByStage[stageIndex + 1]),
                dueDate: existingAssignment.dueDate || addDays(doc.submittedDate, 3 + (stageIndex * 4) + (index % 3)),
                completedBy: existingAssignment.completedBy || '',
                completedByObjectId: existingAssignment.completedByObjectId || '',
                completedByTenantId: existingAssignment.completedByTenantId || '',
                completedByUPN: existingAssignment.completedByUPN || '',
                completedAt: existingAssignment.completedAt || '',
                status: existingAssignment.status || (stageIndex + 1 < doc.stageNumber ? 'completed' : stageIndex + 1 === doc.stageNumber ? 'active' : 'pending')
            };
        });

        return {
            ...doc,
            originatingOffice: doc.office,
            priorityLevel: priorityByStatus[doc.status] || 'Standard',
            stageOwner: doc.assignee,
            nextReviewer,
            stageDeadline: doc.dueDate,
            currentStageCompletedBy: doc.currentStageCompletedBy || stageAssignments[Math.max(0, (doc.stageNumber || 1) - 1)]?.completedBy || '',
            currentStageCompletedByObjectId: doc.currentStageCompletedByObjectId || '',
            currentStageCompletedByTenantId: doc.currentStageCompletedByTenantId || '',
            currentStageCompletedByUPN: doc.currentStageCompletedByUPN || '',
            currentStageCompletedAt: doc.currentStageCompletedAt || stageAssignments[Math.max(0, (doc.stageNumber || 1) - 1)]?.completedAt || '',
            federalRegisterTarget,
            documentClassification: classificationByType[doc.type] || 'Agency Document',
            regulatoryCategory: categoryByType[doc.type] || 'General',
            publicCommentDays: commentDays,
            relatedDockets: `${officeProfile.docketPrefix}-${new Date(doc.submittedDate + 'T00:00:00').getFullYear()}-${String(index + 101).padStart(4, '0')}`,
            statutoryAuthority: officeProfile.statutoryAuthority,
            statutoryDeadline,
            ombReviewRequired: doc.type === 'guidance' ? 'No' : 'Yes',
            rin: `${officeProfile.rinPrefix}-${String(1100 + index)}`,
            cfrCitation: officeProfile.cfrCitation,
            praBurdenHours: 120 + (index * 18),
            foiaSensitivity: foiaByStatus[doc.status] || 'Internal Draft',
            privacyPII: piiByType[doc.type] || 'No',
            legalPointOfContact: officeProfile.legalPointOfContact,
            policyLead: officeProfile.policyLead,
            commentWindowOpens,
            commentWindowCloses,
            riskCategory: riskByStatus[doc.status] || 'Moderate',
            nextMilestone,
            summary: `${doc.title} is currently in ${doc.currentStage}. This sample notice package tracks routing, review readiness, and publication timing for ${doc.office}.`,
            specialInstructions: doc.status === 'completed'
                ? 'Published record retained with final signed package and supporting exhibits.'
                : 'Coordinate reviewer comments against the current version before advancing to the next stage.',
            primaryDocument,
            supportingDocuments,
            stageAssignments
        };
    });
})();
