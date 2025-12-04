# n8n MCP Server

[![MCP](https://img.shields.io/badge/MCP-1.0-blue)](https://modelcontextprotocol.io)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

A Model Context Protocol (MCP) server that provides comprehensive tools for managing and automating n8n workflows. This server exposes 27 tools covering workflow management, execution control, credentials, tags, and includes workflow templates for common automation patterns.

## Features

### Workflow Management (8 tools)
- **n8n_list_workflows** - List all workflows with optional filtering by active status, tags, pagination
- **n8n_get_workflow** - Get detailed information about a specific workflow
- **n8n_create_workflow** - Create a new workflow with nodes, connections, and settings
- **n8n_update_workflow** - Update an existing workflow's configuration
- **n8n_delete_workflow** - Delete a workflow
- **n8n_activate_workflow** - Activate a workflow
- **n8n_deactivate_workflow** - Deactivate a workflow
- **n8n_execute_workflow** - Execute a workflow manually with optional input data

### Execution Management (5 tools)
- **n8n_list_executions** - List workflow executions with filtering by workflow ID, status, pagination
- **n8n_get_execution** - Get detailed information about a specific execution
- **n8n_retry_execution** - Retry a failed execution
- **n8n_stop_execution** - Stop a currently running execution
- **n8n_delete_execution** - Delete an execution record

### Credentials Management (5 tools)
- **n8n_list_credentials** - List all credentials (without sensitive data)
- **n8n_get_credential** - Get credential details (without sensitive data)
- **n8n_create_credential** - Create a new credential
- **n8n_update_credential** - Update an existing credential
- **n8n_delete_credential** - Delete a credential

### Tags Management (5 tools)
- **n8n_list_tags** - List all tags with pagination
- **n8n_create_tag** - Create a new tag
- **n8n_update_tag** - Update a tag
- **n8n_delete_tag** - Delete a tag
- **n8n_add_tags_to_workflow** - Add tags to a workflow

### Utilities (4 tools)
- **n8n_list_node_types** - List available node types with search capability
- **n8n_list_webhooks** - List all active webhooks from workflows
- **n8n_get_execution_stats** - Get execution statistics (total, success, error, waiting, running)
- **n8n_health_check** - Check n8n server health status

### Workflow Templates (7 templates)
Pre-configured workflow templates for common automation patterns:
- **webhook_trigger** - Basic webhook-triggered workflow
- **schedule_trigger** - Scheduled workflow (hourly by default)
- **http_request** - HTTP request workflow
- **email_notification** - Email notification workflow
- **database_query** - Database query workflow
- **file_processor** - File processing workflow
- **api_integration** - API integration workflow

## Installation

### Prerequisites
- Node.js 20.x or higher
- TypeScript 5.3 or higher
- An n8n instance (self-hosted or cloud)
- n8n API key

### Setup

1. Clone this repository or navigate to the directory:
```bash
cd C:\Users\Administrator\mcp-servers\n8n
```

2. Install dependencies:
```bash
npm install
```

3. Build the TypeScript code:
```bash
npm run build
```

This will compile the TypeScript source files in `src/` to JavaScript in `dist/`.

## Configuration

The server requires two environment variables to connect to your n8n instance:

- **N8N_URL** - The URL of your n8n instance (default: http://localhost:5678)
- **N8N_API_KEY** - Your n8n API key

### Getting an n8n API Key

1. Log in to your n8n instance
2. Go to Settings > API
3. Generate a new API key
4. Copy the key for use in configuration

### Claude Desktop Configuration

Add the server to your Claude Desktop configuration file:

**Windows:** `%APPDATA%\Claude\claude_desktop_config.json`
**macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "n8n": {
      "type": "stdio",
      "command": "node",
      "args": ["C:/Users/Administrator/mcp-servers/n8n/dist/index.js"],
      "env": {
        "N8N_URL": "http://192.168.15.231:5678",
        "N8N_API_KEY": "your-api-key-here"
      }
    }
  }
}
```

### MCP Inspector Configuration

For testing with MCP Inspector:

```json
{
  "n8n": {
    "type": "stdio",
    "command": "node",
    "args": ["./dist/index.js"],
    "env": {
      "N8N_URL": "http://localhost:5678",
      "N8N_API_KEY": "your-api-key-here"
    }
  }
}
```

## Usage Examples

### List All Workflows
```typescript
// Get all workflows
n8n_list_workflows({})

// Get only active workflows
n8n_list_workflows({ active: true })

// Filter by tags
n8n_list_workflows({ tags: ["automation", "production"] })
```

### Create a Workflow from Template
```typescript
// Get a webhook workflow template
const template = n8n_get_workflow_template({ template_type: "webhook_trigger" })

// Create the workflow
n8n_create_workflow({
  name: "My Webhook Workflow",
  nodes: template.nodes,
  connections: template.connections
})
```

### Execute a Workflow
```typescript
// Execute with input data
n8n_execute_workflow({
  workflow_id: "abc123",
  data: {
    name: "John Doe",
    email: "john@example.com"
  }
})
```

### Monitor Execution Statistics
```typescript
// Get overall stats
n8n_get_execution_stats({})

// Get stats for specific workflow
n8n_get_execution_stats({ workflow_id: "abc123" })
```

### Manage Credentials
```typescript
// List all credentials (sensitive data excluded)
n8n_list_credentials({})

// Create a new credential
n8n_create_credential({
  name: "My API Credential",
  type: "httpBasicAuth",
  data: {
    user: "username",
    password: "password"
  }
})
```

### List Active Webhooks
```typescript
// Get all active webhooks with URLs
n8n_list_webhooks({})
```

## Tool Reference

### Workflow Management

#### n8n_list_workflows
Lists all workflows with optional filtering.

**Parameters:**
- `active` (boolean, optional) - Filter by active status
- `tags` (string[], optional) - Filter by tag names
- `limit` (number, optional) - Maximum workflows to return
- `cursor` (string, optional) - Pagination cursor

**Returns:** Array of workflow objects

#### n8n_get_workflow
Get detailed information about a specific workflow.

**Parameters:**
- `workflow_id` (string, required) - Workflow ID

**Returns:** Workflow object with full details

#### n8n_create_workflow
Create a new workflow.

**Parameters:**
- `name` (string, required) - Workflow name
- `nodes` (array, optional) - Array of node configurations
- `connections` (object, optional) - Node connections configuration
- `settings` (object, optional) - Workflow settings
- `staticData` (object, optional) - Static data for the workflow

**Returns:** Created workflow object

#### n8n_update_workflow
Update an existing workflow.

**Parameters:**
- `workflow_id` (string, required) - Workflow ID
- `name` (string, optional) - New workflow name
- `nodes` (array, optional) - Updated nodes
- `connections` (object, optional) - Updated connections
- `settings` (object, optional) - Updated settings

**Returns:** Updated workflow object

#### n8n_delete_workflow
Delete a workflow.

**Parameters:**
- `workflow_id` (string, required) - Workflow ID to delete

**Returns:** Success message

#### n8n_activate_workflow / n8n_deactivate_workflow
Activate or deactivate a workflow.

**Parameters:**
- `workflow_id` (string, required) - Workflow ID

**Returns:** Updated workflow object

#### n8n_execute_workflow
Execute a workflow manually.

**Parameters:**
- `workflow_id` (string, required) - Workflow ID
- `data` (object, optional) - Input data for the workflow

**Returns:** Execution object

### Execution Management

#### n8n_list_executions
List workflow executions with optional filters.

**Parameters:**
- `workflow_id` (string, optional) - Filter by workflow ID
- `status` (string, optional) - Filter by status: "error", "success", "waiting"
- `limit` (number, optional) - Maximum executions to return
- `cursor` (string, optional) - Pagination cursor
- `includeData` (boolean, optional) - Include execution data

**Returns:** Array of execution objects

#### n8n_get_execution
Get details of a specific execution.

**Parameters:**
- `execution_id` (string, required) - Execution ID
- `includeData` (boolean, optional) - Include full execution data

**Returns:** Execution object with details

#### n8n_retry_execution
Retry a failed execution.

**Parameters:**
- `execution_id` (string, required) - Execution ID to retry

**Returns:** New execution object

#### n8n_stop_execution
Stop a running execution.

**Parameters:**
- `execution_id` (string, required) - Execution ID to stop

**Returns:** Success message

#### n8n_delete_execution
Delete an execution record.

**Parameters:**
- `execution_id` (string, required) - Execution ID to delete

**Returns:** Success message

### Credentials Management

#### n8n_list_credentials
List all credentials (without sensitive data).

**Parameters:**
- `type` (string, optional) - Filter by credential type

**Returns:** Array of credential objects (sensitive data excluded)

#### n8n_get_credential
Get credential details (without sensitive data).

**Parameters:**
- `credential_id` (string, required) - Credential ID

**Returns:** Credential object (sensitive data excluded)

#### n8n_create_credential
Create a new credential.

**Parameters:**
- `name` (string, required) - Credential name
- `type` (string, required) - Credential type (e.g., "httpBasicAuth")
- `data` (object, required) - Credential data

**Returns:** Created credential object

#### n8n_update_credential
Update an existing credential.

**Parameters:**
- `credential_id` (string, required) - Credential ID
- `name` (string, optional) - New credential name
- `data` (object, optional) - Updated credential data

**Returns:** Updated credential object

#### n8n_delete_credential
Delete a credential.

**Parameters:**
- `credential_id` (string, required) - Credential ID to delete

**Returns:** Success message

### Tags Management

#### n8n_list_tags
List all tags.

**Parameters:**
- `limit` (number, optional) - Maximum tags to return
- `cursor` (string, optional) - Pagination cursor

**Returns:** Array of tag objects

#### n8n_create_tag
Create a new tag.

**Parameters:**
- `name` (string, required) - Tag name

**Returns:** Created tag object

#### n8n_update_tag
Update a tag.

**Parameters:**
- `tag_id` (string, required) - Tag ID
- `name` (string, required) - New tag name

**Returns:** Updated tag object

#### n8n_delete_tag
Delete a tag.

**Parameters:**
- `tag_id` (string, required) - Tag ID to delete

**Returns:** Success message

#### n8n_add_tags_to_workflow
Add tags to a workflow.

**Parameters:**
- `workflow_id` (string, required) - Workflow ID
- `tag_ids` (string[], required) - Tag IDs to add

**Returns:** Updated workflow object

### Utilities

#### n8n_list_node_types
List available node types.

**Parameters:**
- `search` (string, optional) - Search term to filter nodes

**Returns:** Array of node type objects with name, type, and category

#### n8n_list_webhooks
List all active webhooks from workflows.

**Parameters:** None

**Returns:** Array of webhook objects with workflow info, path, method, and full URL

#### n8n_get_execution_stats
Get execution statistics.

**Parameters:**
- `workflow_id` (string, optional) - Filter by workflow ID
- `period` (string, optional) - Time period: "day", "week", "month"

**Returns:** Statistics object with total, success, error, waiting, running counts

#### n8n_health_check
Check n8n server health status.

**Parameters:** None

**Returns:** Health status object with status and URL

#### n8n_get_workflow_template
Get a workflow template for common automation patterns.

**Parameters:**
- `template_type` (string, required) - Type of template:
  - "webhook_trigger"
  - "schedule_trigger"
  - "http_request"
  - "email_notification"
  - "database_query"
  - "file_processor"
  - "api_integration"

**Returns:** Workflow template object with nodes and connections

## Development

### Project Structure
```
n8n-mcp/
├── src/
│   └── index.ts          # Main server implementation
├── dist/                 # Compiled JavaScript (generated)
├── package.json          # Dependencies and scripts
├── tsconfig.json         # TypeScript configuration
└── README.md            # This file
```

### Building
```bash
npm run build
```

### Development Mode
```bash
npm run dev
```

### Testing with MCP Inspector
```bash
npx @modelcontextprotocol/inspector node dist/index.js
```

## n8n API Reference

This MCP server uses the n8n REST API v1. For more information about the n8n API:
- [n8n API Documentation](https://docs.n8n.io/api/)
- [n8n Workflow Structure](https://docs.n8n.io/workflows/)

## Security Considerations

- API keys are passed through environment variables and not stored in the codebase
- Credential data is sanitized when listing or retrieving credentials to exclude sensitive information
- The server uses HTTPS by default when connecting to remote n8n instances
- All API requests include a 60-second timeout to prevent hanging connections

## Troubleshooting

### "Authentication Failed" Error
- Verify your N8N_API_KEY is correct
- Check that your n8n instance has API access enabled
- Ensure your API key has not expired

### "Connection Refused" Error
- Verify the N8N_URL is correct and accessible
- Check that your n8n instance is running
- Verify firewall rules allow connections to the n8n port

### "Tool Not Found" Error
- Ensure you've rebuilt the server after any code changes: `npm run build`
- Restart Claude Desktop after configuration changes

### Workflow Execution Fails
- Check the workflow has all required credentials configured
- Verify the workflow is activated
- Review execution logs in the n8n UI for detailed error messages

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Built with the [Model Context Protocol SDK](https://github.com/modelcontextprotocol/sdk)
- Powered by [n8n](https://n8n.io/) - Fair-code workflow automation
- TypeScript support provided by the TypeScript team

## Related Resources

- [Model Context Protocol Documentation](https://modelcontextprotocol.io)
- [n8n Documentation](https://docs.n8n.io)
- [Claude Desktop](https://claude.ai/desktop)
- [MCP Inspector](https://github.com/modelcontextprotocol/inspector)

## Support

For issues and questions:
- Open an issue on GitHub
- Check the n8n community forum
- Review the MCP documentation

## Changelog

### Version 1.0.0
- Initial release
- 27 tools covering workflows, executions, credentials, tags, and utilities
- 7 workflow templates for common automation patterns
- Full TypeScript implementation
- Comprehensive error handling and data sanitization
