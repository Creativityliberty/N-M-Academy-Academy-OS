import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Mcp\McpGatewayController::__invoke
* @see app/Http/Controllers/Mcp/McpGatewayController.php:19
* @route '/mcp'
*/
const McpGatewayController = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: McpGatewayController.url(options),
    method: 'post',
})

McpGatewayController.definition = {
    methods: ["post"],
    url: '/mcp',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Mcp\McpGatewayController::__invoke
* @see app/Http/Controllers/Mcp/McpGatewayController.php:19
* @route '/mcp'
*/
McpGatewayController.url = (options?: RouteQueryOptions) => {
    return McpGatewayController.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Mcp\McpGatewayController::__invoke
* @see app/Http/Controllers/Mcp/McpGatewayController.php:19
* @route '/mcp'
*/
McpGatewayController.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: McpGatewayController.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Mcp\McpGatewayController::__invoke
* @see app/Http/Controllers/Mcp/McpGatewayController.php:19
* @route '/mcp'
*/
const McpGatewayControllerForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: McpGatewayController.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Mcp\McpGatewayController::__invoke
* @see app/Http/Controllers/Mcp/McpGatewayController.php:19
* @route '/mcp'
*/
McpGatewayControllerForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: McpGatewayController.url(options),
    method: 'post',
})

McpGatewayController.form = McpGatewayControllerForm

export default McpGatewayController