#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import axios, { AxiosInstance } from "axios";

// Configuration from environment
const N8N_URL = process.env.N8N_URL || "http://localhost:5678";
const N8N_API_KEY = process.env.N8N_API_KEY || "";

// Create axios instance for n8n API
const n8nClient: AxiosInstance = axios.create({
  baseURL: `${N8N_URL}/api/v1`,
  headers: {
    "X-N8N-API-KEY": N8N_API_KEY,
    "Content-Type": "application/json",
  },
  timeout: 60000,
});

// Tool definitions
const tools = [
  // Workflow Management
  {
    name: "n8n_list_workflows",
    description: "List all workflows in n8n",
    inputSchema: {
      type: "object",
      properties: {
        active: { type: "boolean", description: "Filter by active status" },
        tags: {
          type: "array",
          items: { type: "string" },
          description: "Filter by tag names",
        },
        limit: { type: "number", description: "Maximum number of workflows to return" },
        cursor: { type: "string", description: "Pagination cursor" },
      },
    },
  },
  {
    name: "n8n_get_workflow",
    description: "Get detailed information about a specific workflow",
    inputSchema: {
      type: "object",
      properties: {
        workflow_id: { type: "string", description: "Workflow ID" },
      },
      required: ["workflow_id"],
    },
  },
  {
    name: "n8n_create_workflow",
    description: "Create a new workflow",
    inputSchema: {
      type: "object",
      properties: {
        name: { type: "string", description: "Workflow name" },
        nodes: {
          type: "array",
          description: "Array of node configurations",
        },
        connections: {
          type: "object",
          description: "Node connections configuration",
        },
        settings: {
          type: "object",
          description: "Workflow settings",
        },
        staticData: {
          type: "object",
          description: "Static data for the workflow",
        },
      },
      required: ["name"],
    },
  },
  {
    name: "n8n_update_workflow",
    description: "Update an existing workflow",
    inputSchema: {
      type: "object",
      properties: {
        workflow_id: { type: "string", description: "Workflow ID" },
        name: { type: "string", description: "New workflow name" },
        nodes: { type: "array", description: "Updated nodes" },
        connections: { type: "object", description: "Updated connections" },
        settings: { type: "object", description: "Updated settings" },
      },
      required: ["workflow_id"],
    },
  },
  {
    name: "n8n_delete_workflow",
    description: "Delete a workflow",
    inputSchema: {
      type: "object",
      properties: {
        workflow_id: { type: "string", description: "Workflow ID to delete" },
      },
      required: ["workflow_id"],
    },
  },
  {
    name: "n8n_activate_workflow",
    description: "Activate a workflow",
    inputSchema: {
      type: "object",
      properties: {
        workflow_id: { type: "string", description: "Workflow ID" },
      },
      required: ["workflow_id"],
    },
  },
  {
    name: "n8n_deactivate_workflow",
    description: "Deactivate a workflow",
    inputSchema: {
      type: "object",
      properties: {
        workflow_id: { type: "string", description: "Workflow ID" },
      },
      required: ["workflow_id"],
    },
  },
  {
    name: "n8n_execute_workflow",
    description: "Execute a workflow manually with optional input data",
    inputSchema: {
      type: "object",
      properties: {
        workflow_id: { type: "string", description: "Workflow ID" },
        data: { type: "object", description: "Input data for the workflow" },
      },
      required: ["workflow_id"],
    },
  },

  // Execution Management
  {
    name: "n8n_list_executions",
    description: "List workflow executions with optional filters",
    inputSchema: {
      type: "object",
      properties: {
        workflow_id: { type: "string", description: "Filter by workflow ID" },
        status: {
          type: "string",
          enum: ["error", "success", "waiting"],
          description: "Filter by execution status",
        },
        limit: { type: "number", description: "Maximum executions to return" },
        cursor: { type: "string", description: "Pagination cursor" },
        includeData: { type: "boolean", description: "Include execution data" },
      },
    },
  },
  {
    name: "n8n_get_execution",
    description: "Get details of a specific execution",
    inputSchema: {
      type: "object",
      properties: {
        execution_id: { type: "string", description: "Execution ID" },
        includeData: { type: "boolean", description: "Include full execution data" },
      },
      required: ["execution_id"],
    },
  },
  {
    name: "n8n_retry_execution",
    description: "Retry a failed execution",
    inputSchema: {
      type: "object",
      properties: {
        execution_id: { type: "string", description: "Execution ID to retry" },
      },
      required: ["execution_id"],
    },
  },
  {
    name: "n8n_stop_execution",
    description: "Stop a running execution",
    inputSchema: {
      type: "object",
      properties: {
        execution_id: { type: "string", description: "Execution ID to stop" },
      },
      required: ["execution_id"],
    },
  },
  {
    name: "n8n_delete_execution",
    description: "Delete an execution record",
    inputSchema: {
      type: "object",
      properties: {
        execution_id: { type: "string", description: "Execution ID to delete" },
      },
      required: ["execution_id"],
    },
  },

  // Credentials Management
  {
    name: "n8n_list_credentials",
    description: "List all credentials (without sensitive data)",
    inputSchema: {
      type: "object",
      properties: {
        type: { type: "string", description: "Filter by credential type" },
      },
    },
  },
  {
    name: "n8n_get_credential",
    description: "Get credential details (without sensitive data)",
    inputSchema: {
      type: "object",
      properties: {
        credential_id: { type: "string", description: "Credential ID" },
      },
      required: ["credential_id"],
    },
  },
  {
    name: "n8n_create_credential",
    description: "Create a new credential",
    inputSchema: {
      type: "object",
      properties: {
        name: { type: "string", description: "Credential name" },
        type: { type: "string", description: "Credential type (e.g., httpBasicAuth)" },
        data: { type: "object", description: "Credential data" },
      },
      required: ["name", "type", "data"],
    },
  },
  {
    name: "n8n_update_credential",
    description: "Update an existing credential",
    inputSchema: {
      type: "object",
      properties: {
        credential_id: { type: "string", description: "Credential ID" },
        name: { type: "string", description: "New credential name" },
        data: { type: "object", description: "Updated credential data" },
      },
      required: ["credential_id"],
    },
  },
  {
    name: "n8n_delete_credential",
    description: "Delete a credential",
    inputSchema: {
      type: "object",
      properties: {
        credential_id: { type: "string", description: "Credential ID to delete" },
      },
      required: ["credential_id"],
    },
  },

  // Tags Management
  {
    name: "n8n_list_tags",
    description: "List all tags",
    inputSchema: {
      type: "object",
      properties: {
        limit: { type: "number", description: "Maximum tags to return" },
        cursor: { type: "string", description: "Pagination cursor" },
      },
    },
  },
  {
    name: "n8n_create_tag",
    description: "Create a new tag",
    inputSchema: {
      type: "object",
      properties: {
        name: { type: "string", description: "Tag name" },
      },
      required: ["name"],
    },
  },
  {
    name: "n8n_update_tag",
    description: "Update a tag",
    inputSchema: {
      type: "object",
      properties: {
        tag_id: { type: "string", description: "Tag ID" },
        name: { type: "string", description: "New tag name" },
      },
      required: ["tag_id", "name"],
    },
  },
  {
    name: "n8n_delete_tag",
    description: "Delete a tag",
    inputSchema: {
      type: "object",
      properties: {
        tag_id: { type: "string", description: "Tag ID to delete" },
      },
      required: ["tag_id"],
    },
  },
  {
    name: "n8n_add_tags_to_workflow",
    description: "Add tags to a workflow",
    inputSchema: {
      type: "object",
      properties: {
        workflow_id: { type: "string", description: "Workflow ID" },
        tag_ids: {
          type: "array",
          items: { type: "string" },
          description: "Tag IDs to add",
        },
      },
      required: ["workflow_id", "tag_ids"],
    },
  },

  // Node Information
  {
    name: "n8n_list_node_types",
    description: "List available node types",
    inputSchema: {
      type: "object",
      properties: {
        search: { type: "string", description: "Search term to filter nodes" },
      },
    },
  },

  // Webhooks
  {
    name: "n8n_list_webhooks",
    description: "List all active webhooks",
    inputSchema: {
      type: "object",
      properties: {},
    },
  },

  // Statistics
  {
    name: "n8n_get_execution_stats",
    description: "Get execution statistics",
    inputSchema: {
      type: "object",
      properties: {
        workflow_id: { type: "string", description: "Filter by workflow ID" },
        period: {
          type: "string",
          enum: ["day", "week", "month"],
          description: "Time period for statistics",
        },
      },
    },
  },

  // Health & Info
  {
    name: "n8n_health_check",
    description: "Check n8n server health status",
    inputSchema: {
      type: "object",
      properties: {},
    },
  },

  // Workflow Templates
  {
    name: "n8n_get_workflow_template",
    description: "Get a workflow template for common automation patterns",
    inputSchema: {
      type: "object",
      properties: {
        template_type: {
          type: "string",
          enum: [
            "webhook_trigger",
            "schedule_trigger",
            "http_request",
            "email_notification",
            "database_query",
            "file_processor",
            "api_integration",
          ],
          description: "Type of workflow template",
        },
      },
      required: ["template_type"],
    },
  },
];

// Workflow templates
const workflowTemplates: Record<string, any> = {
  webhook_trigger: {
    name: "Webhook Triggered Workflow",
    nodes: [
      {
        parameters: {
          path: "webhook-endpoint",
          responseMode: "responseNode",
        },
        name: "Webhook",
        type: "n8n-nodes-base.webhook",
        position: [250, 300],
      },
      {
        parameters: {},
        name: "Respond to Webhook",
        type: "n8n-nodes-base.respondToWebhook",
        position: [450, 300],
      },
    ],
    connections: {
      Webhook: {
        main: [[{ node: "Respond to Webhook", type: "main", index: 0 }]],
      },
    },
  },
  schedule_trigger: {
    name: "Scheduled Workflow",
    nodes: [
      {
        parameters: {
          rule: {
            interval: [{ field: "hours", hoursInterval: 1 }],
          },
        },
        name: "Schedule Trigger",
        type: "n8n-nodes-base.scheduleTrigger",
        position: [250, 300],
      },
      {
        parameters: {},
        name: "No Operation",
        type: "n8n-nodes-base.noOp",
        position: [450, 300],
      },
    ],
    connections: {
      "Schedule Trigger": {
        main: [[{ node: "No Operation", type: "main", index: 0 }]],
      },
    },
  },
  http_request: {
    name: "HTTP Request Workflow",
    nodes: [
      {
        parameters: {
          path: "trigger",
        },
        name: "Webhook",
        type: "n8n-nodes-base.webhook",
        position: [250, 300],
      },
      {
        parameters: {
          url: "https://api.example.com/endpoint",
          method: "GET",
          options: {},
        },
        name: "HTTP Request",
        type: "n8n-nodes-base.httpRequest",
        position: [450, 300],
      },
    ],
    connections: {
      Webhook: {
        main: [[{ node: "HTTP Request", type: "main", index: 0 }]],
      },
    },
  },
  email_notification: {
    name: "Email Notification Workflow",
    nodes: [
      {
        parameters: {
          path: "notify",
        },
        name: "Webhook",
        type: "n8n-nodes-base.webhook",
        position: [250, 300],
      },
      {
        parameters: {
          fromEmail: "noreply@example.com",
          toEmail: "recipient@example.com",
          subject: "Notification",
          text: "You have a new notification",
        },
        name: "Send Email",
        type: "n8n-nodes-base.emailSend",
        position: [450, 300],
      },
    ],
    connections: {
      Webhook: {
        main: [[{ node: "Send Email", type: "main", index: 0 }]],
      },
    },
  },
};

// Tool handler implementations
async function handleTool(name: string, args: Record<string, unknown>): Promise<string> {
  try {
    switch (name) {
      // Workflow Management
      case "n8n_list_workflows": {
        const params: any = {};
        if (args.active !== undefined) params.active = args.active;
        if (args.tags) params.tags = (args.tags as string[]).join(",");
        if (args.limit) params.limit = args.limit;
        if (args.cursor) params.cursor = args.cursor;

        const response = await n8nClient.get("/workflows", { params });
        return JSON.stringify(response.data, null, 2);
      }

      case "n8n_get_workflow": {
        const response = await n8nClient.get(`/workflows/${args.workflow_id}`);
        return JSON.stringify(response.data, null, 2);
      }

      case "n8n_create_workflow": {
        const payload: any = {
          name: args.name,
          nodes: args.nodes || [],
          connections: args.connections || {},
          settings: args.settings || {},
          staticData: args.staticData || null,
        };
        const response = await n8nClient.post("/workflows", payload);
        return JSON.stringify(response.data, null, 2);
      }

      case "n8n_update_workflow": {
        const { workflow_id, ...updateData } = args;
        const response = await n8nClient.patch(`/workflows/${workflow_id}`, updateData);
        return JSON.stringify(response.data, null, 2);
      }

      case "n8n_delete_workflow": {
        await n8nClient.delete(`/workflows/${args.workflow_id}`);
        return `Workflow ${args.workflow_id} deleted successfully`;
      }

      case "n8n_activate_workflow": {
        const response = await n8nClient.patch(`/workflows/${args.workflow_id}`, {
          active: true,
        });
        return JSON.stringify(response.data, null, 2);
      }

      case "n8n_deactivate_workflow": {
        const response = await n8nClient.patch(`/workflows/${args.workflow_id}`, {
          active: false,
        });
        return JSON.stringify(response.data, null, 2);
      }

      case "n8n_execute_workflow": {
        const response = await n8nClient.post(`/workflows/${args.workflow_id}/execute`, {
          data: args.data || {},
        });
        return JSON.stringify(response.data, null, 2);
      }

      // Execution Management
      case "n8n_list_executions": {
        const params: any = {};
        if (args.workflow_id) params.workflowId = args.workflow_id;
        if (args.status) params.status = args.status;
        if (args.limit) params.limit = args.limit;
        if (args.cursor) params.cursor = args.cursor;
        if (args.includeData) params.includeData = args.includeData;

        const response = await n8nClient.get("/executions", { params });
        return JSON.stringify(response.data, null, 2);
      }

      case "n8n_get_execution": {
        const params: any = {};
        if (args.includeData) params.includeData = args.includeData;

        const response = await n8nClient.get(`/executions/${args.execution_id}`, { params });
        return JSON.stringify(response.data, null, 2);
      }

      case "n8n_retry_execution": {
        const response = await n8nClient.post(`/executions/${args.execution_id}/retry`);
        return JSON.stringify(response.data, null, 2);
      }

      case "n8n_stop_execution": {
        const response = await n8nClient.post(`/executions/${args.execution_id}/stop`);
        return `Execution ${args.execution_id} stopped`;
      }

      case "n8n_delete_execution": {
        await n8nClient.delete(`/executions/${args.execution_id}`);
        return `Execution ${args.execution_id} deleted`;
      }

      // Credentials Management
      case "n8n_list_credentials": {
        const params: any = {};
        if (args.type) params.type = args.type;

        const response = await n8nClient.get("/credentials", { params });
        // Remove sensitive data from response
        const sanitized = response.data.data?.map((cred: any) => ({
          id: cred.id,
          name: cred.name,
          type: cred.type,
          createdAt: cred.createdAt,
          updatedAt: cred.updatedAt,
        }));
        return JSON.stringify({ data: sanitized }, null, 2);
      }

      case "n8n_get_credential": {
        const response = await n8nClient.get(`/credentials/${args.credential_id}`);
        // Remove sensitive data
        const { data, ...safe } = response.data;
        return JSON.stringify(safe, null, 2);
      }

      case "n8n_create_credential": {
        const response = await n8nClient.post("/credentials", {
          name: args.name,
          type: args.type,
          data: args.data,
        });
        return JSON.stringify({ id: response.data.id, name: response.data.name }, null, 2);
      }

      case "n8n_update_credential": {
        const { credential_id, ...updateData } = args;
        const response = await n8nClient.patch(`/credentials/${credential_id}`, updateData);
        return JSON.stringify({ id: response.data.id, name: response.data.name }, null, 2);
      }

      case "n8n_delete_credential": {
        await n8nClient.delete(`/credentials/${args.credential_id}`);
        return `Credential ${args.credential_id} deleted`;
      }

      // Tags Management
      case "n8n_list_tags": {
        const params: any = {};
        if (args.limit) params.limit = args.limit;
        if (args.cursor) params.cursor = args.cursor;

        const response = await n8nClient.get("/tags", { params });
        return JSON.stringify(response.data, null, 2);
      }

      case "n8n_create_tag": {
        const response = await n8nClient.post("/tags", { name: args.name });
        return JSON.stringify(response.data, null, 2);
      }

      case "n8n_update_tag": {
        const response = await n8nClient.patch(`/tags/${args.tag_id}`, { name: args.name });
        return JSON.stringify(response.data, null, 2);
      }

      case "n8n_delete_tag": {
        await n8nClient.delete(`/tags/${args.tag_id}`);
        return `Tag ${args.tag_id} deleted`;
      }

      case "n8n_add_tags_to_workflow": {
        const workflow = await n8nClient.get(`/workflows/${args.workflow_id}`);
        const existingTags = workflow.data.tags || [];
        const newTags = [...existingTags, ...(args.tag_ids as string[]).map((id) => ({ id }))];

        const response = await n8nClient.patch(`/workflows/${args.workflow_id}`, {
          tags: newTags,
        });
        return JSON.stringify(response.data, null, 2);
      }

      // Node Information
      case "n8n_list_node_types": {
        // n8n doesn't have a direct API for this, return common node types
        const commonNodes = [
          { name: "Webhook", type: "n8n-nodes-base.webhook", category: "Triggers" },
          { name: "Schedule Trigger", type: "n8n-nodes-base.scheduleTrigger", category: "Triggers" },
          { name: "HTTP Request", type: "n8n-nodes-base.httpRequest", category: "Data" },
          { name: "Set", type: "n8n-nodes-base.set", category: "Data" },
          { name: "IF", type: "n8n-nodes-base.if", category: "Flow" },
          { name: "Switch", type: "n8n-nodes-base.switch", category: "Flow" },
          { name: "Merge", type: "n8n-nodes-base.merge", category: "Flow" },
          { name: "Code", type: "n8n-nodes-base.code", category: "Data" },
          { name: "Postgres", type: "n8n-nodes-base.postgres", category: "Database" },
          { name: "MySQL", type: "n8n-nodes-base.mySql", category: "Database" },
          { name: "MongoDB", type: "n8n-nodes-base.mongoDb", category: "Database" },
          { name: "Slack", type: "n8n-nodes-base.slack", category: "Communication" },
          { name: "Discord", type: "n8n-nodes-base.discord", category: "Communication" },
          { name: "Email Send", type: "n8n-nodes-base.emailSend", category: "Communication" },
          { name: "Home Assistant", type: "n8n-nodes-base.homeAssistant", category: "IoT" },
          { name: "MQTT", type: "n8n-nodes-base.mqtt", category: "IoT" },
        ];

        let nodes = commonNodes;
        if (args.search) {
          const search = (args.search as string).toLowerCase();
          nodes = nodes.filter(
            (n) => n.name.toLowerCase().includes(search) || n.category.toLowerCase().includes(search)
          );
        }
        return JSON.stringify(nodes, null, 2);
      }

      // Webhooks
      case "n8n_list_webhooks": {
        // Get all active workflows and extract webhook info
        const response = await n8nClient.get("/workflows", { params: { active: true } });
        const webhooks: any[] = [];

        for (const workflow of response.data.data || []) {
          const nodes = workflow.nodes || [];
          for (const node of nodes) {
            if (node.type === "n8n-nodes-base.webhook") {
              webhooks.push({
                workflowId: workflow.id,
                workflowName: workflow.name,
                path: node.parameters?.path || "webhook",
                method: node.parameters?.httpMethod || "GET",
                url: `${N8N_URL}/webhook/${node.parameters?.path || "webhook"}`,
              });
            }
          }
        }
        return JSON.stringify(webhooks, null, 2);
      }

      // Statistics
      case "n8n_get_execution_stats": {
        const params: any = { limit: 100 };
        if (args.workflow_id) params.workflowId = args.workflow_id;

        const response = await n8nClient.get("/executions", { params });
        const executions = response.data.data || [];

        const stats = {
          total: executions.length,
          success: executions.filter((e: any) => e.status === "success").length,
          error: executions.filter((e: any) => e.status === "error").length,
          waiting: executions.filter((e: any) => e.status === "waiting").length,
          running: executions.filter((e: any) => e.status === "running").length,
        };

        return JSON.stringify(stats, null, 2);
      }

      // Health Check
      case "n8n_health_check": {
        try {
          // Try to list workflows as a health check
          await n8nClient.get("/workflows", { params: { limit: 1 } });
          return JSON.stringify({ status: "healthy", url: N8N_URL }, null, 2);
        } catch (error: any) {
          return JSON.stringify(
            {
              status: "unhealthy",
              url: N8N_URL,
              error: error.message,
            },
            null,
            2
          );
        }
      }

      // Workflow Templates
      case "n8n_get_workflow_template": {
        const template = workflowTemplates[args.template_type as string];
        if (!template) {
          return `Unknown template type: ${args.template_type}. Available: ${Object.keys(workflowTemplates).join(", ")}`;
        }
        return JSON.stringify(template, null, 2);
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error: any) {
    if (error.response) {
      throw new Error(`n8n API error: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
    }
    throw error;
  }
}

// Create and configure the MCP server
const server = new Server(
  {
    name: "n8n-mcp",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Register tool list handler
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return { tools };
});

// Register tool call handler
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  try {
    const result = await handleTool(name, args as Record<string, unknown>);
    return {
      content: [{ type: "text", text: result }],
    };
  } catch (error: any) {
    return {
      content: [{ type: "text", text: `Error: ${error.message}` }],
      isError: true,
    };
  }
});

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("n8n MCP server running");
}

main().catch(console.error);
