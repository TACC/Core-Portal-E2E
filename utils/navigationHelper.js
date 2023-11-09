
export function getPortalUrl(portal, environment) {
    return `https://${environment === 'prod' ? '' : `${environment}.`}${portal}.tacc.utexas.edu`;
}