
export function getPortalUrl(portal, environment) {
    const portalUrl = process.env.NGINX_SERVER_NAME
    return `https://${portalUrl}`;
}