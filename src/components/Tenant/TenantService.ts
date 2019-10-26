import { httpGet, httpPost, httpPut } from "../Lib/RestTemplate";
import { constants } from '../Constants';

export function createTenant(data) {
    return httpPost(constants.API_URL_TENANT+data.name+constants.API_URL_CREATE, {
        name: data.name,
        email: data.email,
        }, null)
        .then(function(response) {
            return Promise.resolve(response);
        })
}

export function sentTenantUrl(data) {
        return httpPost(constants.API_TENANT_URL, data, null)
            .then(function(response) {
                return Promise.resolve(response.status);
            })
}
    


