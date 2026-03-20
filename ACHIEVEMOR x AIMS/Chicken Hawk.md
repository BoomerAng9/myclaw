# Project Chicken Hawk: Cloud-Native Technical Documentation

## 1. Introduction

This document provides a comprehensive technical overview of **Project Chicken Hawk**, a cloud-native autonomous super agent designed for scalable, on-demand execution of complex tasks. This architecture is designed as a commercial Software-as-a-Service (SaaS) offering, hosted entirely on **Google Cloud Platform (GCP)** and incorporating a subscription-based payment model managed via **Stripe**.

### 1.1. Design Philosophy: The Manus Playbook

The core philosophy of Project Chicken Hawk follows the **"Manus Playbook"**: a scalable, serverless architecture that combines a globally distributed frontend with a powerful, on-demand backend. This model prioritizes performance, security, and cost-efficiency.

*   **Global Frontend Deployment**: The user-facing web application is deployed on **Firebase Hosting**, which automatically distributes the static assets to a global Content Delivery Network (CDN). This ensures the lowest possible latency for users worldwide.
*   **Serverless Backend**: The entire backend, from the API to the agent execution logic, is serverless. This eliminates the need for managing servers, provides automatic scaling, and follows a pay-per-use model that is highly cost-effective.
*   **Decoupled, Event-Driven Execution**: Agent tasks are broken down into discrete steps and orchestrated through an event-driven system using **Cloud Tasks** and **Pub/Sub**. This allows for massive parallelism and robust, fault-tolerant execution.

## 2. Architectural Layers

The Chicken Hawk architecture is organized into six distinct, cloud-native layers.

![Cloud Architecture](https://private-us-east-1.manuscdn.com/sessionFile/vg3oE74qCUg7BKyAae9AgD/sandbox/TuG3pA6DZeuju0RyLF0ao6-images_1769521894468_na1fn_L2hvbWUvdWJ1bnR1L2Nsb3VkX2FyY2hpdGVjdHVyZV92Mg.png?Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvdmczb0U3NHFDVWc3Qkt5QWFlOUFnRC9zYW5kYm94L1R1RzNwQTZEWmV1anUwUnlMRjBhbzYtaW1hZ2VzXzE3Njk1MjE4OTQ0NjhfbmExZm5fTDJodmJXVXZkV0oxYm5SMUwyTnNiM1ZrWDJGeVkyaHBkR1ZqZEhWeVpWOTJNZy5wbmciLCJDb25kaXRpb24iOnsiRGF0ZUxlc3NUaGFuIjp7IkFXUzpFcG9jaFRpbWUiOjE3OTg3NjE2MDB9fX1dfQ__&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=cAETUvaNRRUtrrHMpHWTw~f2BWDw53QyjeDPNKGjG~ikuBcswVn0xWbm2vooqVmp5kNsrLbwbwXOWO4crqKo1fVOCaaPfSrYsiVOlKtluL6f-ubpGBlvZNFXp5yIycQtlgkUbkXGfwYi2aLa0hlgDiWqtp8TmXq5~OJvHvbE0-1PRT9duVxd8u154iCaEB9yYAL~bwL~NUCfOIlIcJ7hpIFbBiq6Fs2uI8DjgSEGTWf4DjIDOvU-FTyU9Y08W0nGsHvsa5izB0wXItUVFlNc1nrRa4bQNqfYON6qxvkHSMXuDcCM8f5WWSKbaU5z2hl4DTv7Tth5Cl-e2iSqjIUuwQ__)

| Layer | Primary Components | Key Functionality |
| :--- | :--- | :--- |
| **Presentation Layer** | React/Next.js on **Firebase Hosting (CDN)** | Globally distributed user interface for task submission and account management. |
| **API & Gateway Layer** | Cloud Run Service, API Gateway, Firebase Authentication | Secure endpoint for user requests, authentication, and task initiation. |
| **Control & Orchestration Layer** | Cloud Tasks, Pub/Sub, Firestore | Manages the asynchronous, event-driven agent execution flow. |
| **Execution Layer** | Cloud Run Jobs, Container Registry (GCR) | On-demand, containerized execution of agent logic (Master, Planning, ToolCall). |
| **Persistence Layer** | Firestore, Cloud SQL, Google Cloud Storage, Memorystore | Manages all persistent data, including user info, tasks, memory, and logs. |
| **Billing Layer** | Cloud Run Service (Webhook Handler), Stripe API | Manages user subscriptions, payment processing, and access control. |

### 2.1. Presentation & API Layers
Users interact with the system through a modern web application (React/Next.js) deployed on **Firebase Hosting**. This service automatically caches the application's static assets on its global CDN, providing fast load times for all users. User authentication is handled by **Firebase Authentication**.

Once authenticated, the web app sends requests to a backend API hosted on a **Cloud Run Service**. This service validates the user's subscription status (stored in Firestore) and initiates an agent task by creating a message in a **Cloud Tasks** or **Pub/Sub** queue.

### 2.2. Control & Orchestration Layer
The core agent logic is decoupled into a series of event-driven jobs. When a new task is added to the queue, it triggers the initial **Master Agent** job. The **Planning Agent** (either in the same job or a subsequent one) decomposes the task and stores the plan in **Firestore**. Each step in the plan is then added as a message to a new task queue, which in turn triggers individual **ToolCall Agent** jobs. This architecture allows for fine-grained, parallel execution of sub-tasks.

### 2.3. Execution Layer
This layer is where the agent's work is performed. Each agent (Master, Planning, ToolCall) is packaged as a container image and stored in **Google Container Registry (GCR)**. **Cloud Run Jobs** are used to run these containers on-demand. This serverless approach ensures that compute resources are only allocated for the duration of the job, providing significant cost savings and scalability.

### 2.4. Persistence Layer
All state is externalized to managed GCP services to support the ephemeral nature of the execution jobs.
*   **Firestore**: Serves as the primary database for user data, subscription status, task plans, and the agent's long-term memory.
*   **Cloud SQL**: Can be used for more complex relational data if needed.
*   **Google Cloud Storage (GCS)**: Used for storing large artifacts, such as generated files and detailed execution logs.
*   **Memorystore for Redis**: Provides a high-speed cache for frequently accessed data, such as session information or intermediate task results.

### 2.5. Billing Layer
This layer manages the commercial aspects of the service. It consists of a dedicated **Cloud Run Service** that acts as a webhook handler for **Stripe**. When a subscription event occurs (e.g., `invoice.paid`, `customer.subscription.deleted`), Stripe sends a webhook to this service. The service then updates the user's subscription status in Firestore, granting or revoking access to the agent's capabilities accordingly.

![Billing Flow](https://private-us-east-1.manuscdn.com/sessionFile/vg3oE74qCUg7BKyAae9AgD/sandbox/TuG3pA6DZeuju0RyLF0ao6-images_1769521894470_na1fn_L2hvbWUvdWJ1bnR1L2JpbGxpbmdfZmxvdw.png?Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvdmczb0U3NHFDVWc3Qkt5QWFlOUFnRC9zYW5kYm94L1R1RzNwQTZEWmV1anUwUnlMRjBhbzYtaW1hZ2VzXzE3Njk1MjE4OTQ0NzBfbmExZm5fTDJodmJXVXZkV0oxYm5SMUwySnBiR3hwYm1kZlpteHZkdy5wbmciLCJDb25kaXRpb24iOnsiRGF0ZUxlc3NUaGFuIjp7IkFXUzpFcG9jaFRpbWUiOjE3OTg3NjE2MDB9fX1dfQ__&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=jjS7t-Z2SAVKcv3QXrcHpFJ75NRtHYcGlMfIK~HSt1LeSQzlXUdyfMUXWiv855JjXyE8hPo2rN6OyvHp~1vQadqgMLrR0A7dmZPwl0xyWtA-xKpyE3HVglZjo7xgRIWhndy3Jx1B8W1x12hFauq8PjzULpGVinBsfSIyu3mn1tNbvhqkCpPBKnCxjE6EiuHT~15r6zir-JdPtAqcV7LKtX4PJZXkkchKKkbA0THN0QVVEyQuPNPX4t6vUeIAJUyLQ-yZ9X23BjnHQSrHzcNmwdCN8odWctpT8L41TZguywojDqgB53mleZlP5lV0VJlgyNbQMRWZ5nKYIt31h5IQWg__)

## 3. The Execution Flow (Cloud-Native ODAR)

The ODAR loop is now an orchestrated, asynchronous process:

![Execution Flow](https://private-us-east-1.manuscdn.com/sessionFile/vg3oE74qCUg7BKyAae9AgD/sandbox/TuG3pA6DZeuju0RyLF0ao6-images_1769521894470_na1fn_L2hvbWUvdWJ1bnR1L2V4ZWN1dGlvbl9mbG93.png?Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvdmczb0U3NHFDVWc3Qkt5QWFlOUFnRC9zYW5kYm94L1R1RzNwQTZEWmV1anUwUnlMRjBhbzYtaW1hZ2VzXzE3Njk1MjE4OTQ0NzBfbmExZm5fTDJodmJXVXZkV0oxYm5SMUwyVjRaV04xZEdsdmJsOW1iRzkzLnBuZyIsIkNvbmRpdGlvbiI6eyJEYXRlTGVzc1RoYW4iOnsiQVdTOkVwb2NoVGltZSI6MTc5ODc2MTYwMH19fV19&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=BGB6NqS340GG-P0jKJ39WVUyrZZ~p25-1khLu6QUZDBxzgKpssbY-L7uiewwxbzd29bgSFBtwJcQs7Lm98hnnWFqeF50OubkFJq5TjYZovq2omh0dVZbRz2PYGQf1ccv0DfmT6l9XhHrgIx0xhmblZEC1t8ofnMyV7-B~jjkq~LCJDhIDfxFM7XXiH1fepNH2R2tgg3tQrc-T4wtPqRPO3qxfBA0vYLDrQ7tObgQntw7mmDCoiFJIh2JgMmOU3j3~VNYSxb~gxonE~AhuXTMHKwzDg1RoB8TQ6F03yWnnDjQliBHM87rmzXjuD4pjIcqsQEEOlnU~NceBVi7HltqJA__)

1.  **Trigger**: A user request via the API Gateway creates a task in a Pub/Sub topic.
2.  **Observe**: A Cloud Run Job (Master Agent) is triggered by the Pub/Sub message. It reads the task details from Firestore.
3.  **Decide**: The Planning Agent within the job creates a plan and writes it to Firestore. It then places the first step of the plan onto a "ToolCall" task queue.
4.  **Act**: A new, smaller Cloud Run Job (ToolCall Agent) is triggered. It executes the tool and writes the result back to Firestore.
5.  **Reflect**: The result is processed by a final job or a Cloud Function, which updates the master plan. If the task is complete, the user is notified. If not, the next step is placed on the task queue, continuing the loop.

## 4. Implementation Guidance

### 4.1. Technology Stack

*   **Frontend**: React or Next.js on **Firebase Hosting (CDN)**.
*   **Backend API**: Node.js or Python on Cloud Run Services.
*   **Agent Logic**: Python or Node.js in containers on Cloud Run Jobs.
*   **Database**: Firestore, with optional Cloud SQL and Memorystore.
*   **Storage**: Google Cloud Storage.
*   **Orchestration**: Cloud Tasks or Pub/Sub.
*   **Authentication**: Firebase Authentication.
*   **Payment**: Stripe.

## 5. References

[1] Clawdbot GitHub. *clawdbot/clawdbot: Your own personal AI assistant. Any OS...* [https://github.com/clawdbot/clawdbot]
[2] LLM Multi Agent. *OpenManus Technical Analysis: Architecture and Implementation of an Open-Source Agent Framework*. [https://llmmultiagents.com/en/blogs/OpenManus_Technical_Analysis]
[3] James Li. *OpenManus Architecture Deep Dive: Enterprise AI Agent Development with Real-World Case Studies*. [https://dev.to/jamesli/openmanus-architecture-deep-dive-enterprise-ai-agent-development-with-real-world-case-studies-5hi4]
[4] Google Cloud. *Host AI agents on Cloud Run*. [https://docs.cloud.google.com/run/docs/ai-agents]
[5] Stripe. *A guide to SaaS subscription models*. [https://stripe.com/resources/more/saas-subscription-models-101-a-guide-for-getting-started]
