---
name: "SME_Paperform_Ang Skill Config"
description: "Webhook parsing and intent mapping protocols for Paperform to ACHEEVY."
---

# Paperform Integrator Config

## Core Requirements
SME_Paperform_Ang requires all incoming webhooks from Paperform to adhere to the A.I.M.S Data Quality Check (DQC). 
When Paperform submits a `POST /v1/kyb-onboard`, it sends a payload formatted as:
```json
{
  "data": {
    "submission_id": "sub_12345",
    "created_at": "2026-03-20T00:00:00Z",
    "answers": [
      { "title": "Owner Email", "value": "user@example.com" },
      { "title": "Boomer_Ang Name", "value": "Scripter_Ang" }
    ]
  }
}
```

## Parsing Rules
1. **Extraction**: `SME_Paperform_Ang` extracts `Owner Email` and assigns it to `ownerEmail`.
2. **Identity**: `Boomer_Ang Name` is assigned to `boomerAngName`.
3. **Validation**: Both fields are mandatory. If missing, the payload is rejected at the API layer before hitting INTENT (NTNTN).

## Paperform Dashboard Setup
1. Go to your formal KYB Onboarding form in Paperform.
2. Navigate to **After Submission > Webhooks**.
3. Add Webhook URL: `https://myclaw.foai.cloud/v1/kyb-onboard` (or your edge function).
4. No custom payload is required — SME_Paperform_Ang natively parses the default Paperform structure.
