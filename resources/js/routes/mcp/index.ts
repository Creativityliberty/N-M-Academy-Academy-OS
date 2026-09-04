import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
/**
* @see \App\Http\Controllers\Mcp\McpGatewayController::__invoke
* @see app/Http/Controllers/Mcp/McpGatewayController.php:19
* @route '/mcp'
*/
export const gateway = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: gateway.url(options),
    method: 'post',
})

gateway.definition = {
    methods: ["post"],
    url: '/mcp',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Mcp\McpGatewayController::__invoke
* @see app/Http/Controllers/Mcp/McpGatewayController.php:19
* @route '/mcp'
*/
gateway.url = (options?: RouteQueryOptions) => {
    return gateway.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Mcp\McpGatewayController::__invoke
* @see app/Http/Controllers/Mcp/McpGatewayController.php:19
* @route '/mcp'
*/
gateway.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: gateway.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Mcp\McpGatewayController::__invoke
* @see app/Http/Controllers/Mcp/McpGatewayController.php:19
* @route '/mcp'
*/
const gatewayForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: gateway.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Mcp\McpGatewayController::__invoke
* @see app/Http/Controllers/Mcp/McpGatewayController.php:19
* @route '/mcp'
*/
gatewayForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: gateway.url(options),
    method: 'post',
})

gateway.form = gatewayForm

const mcp = {
    gateway: Object.assign(gateway, gateway),
}

export default mcp