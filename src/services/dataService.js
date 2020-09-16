import Axios from "axios";
import { BehaviorSubject } from 'rxjs';

const carriersUrl = 'https://panel.orderadmin.eu/api/delivery-services';
const servicePointsUrl = 'https://panel.orderadmin.eu/api/delivery-services/service-points';

export const carrierData = new BehaviorSubject([]);
export const servicePoints = new BehaviorSubject([]);
export const error = new BehaviorSubject('');

/**
 * Generate Filter String for URL
 * 
 * @param {Object} filterParams 
 * @param {String | Number} id
 * 
 * @return {String} 
 */
function createFilter(filterParams, id) {
    return Object.keys(filterParams)
        .reduce((arr, key) => {
            const splitedStr = filterParams[key]
                .split(',')
                .filter(str => str.trim() !== '')
                .map((str, index, arr) => {
                    return arr.length === 1
                        ? `filter[${id}][${key}]=${str.trim()}`
                        : `filter[${id}][${key}][${index}]=${str.trim()}`;
                });

            return [...arr, ...splitedStr]
        }, [])
        .join('&');
}

/**
 * Commit error messages
 * 
 * @param {String} message 
 * 
 * @return {Void}
 */
export function commitError(message) {
    error.next(message);

    setTimeout(() => {
        error.next('');
    }, 2500)
}

/**
 * Get data from Back-End
 * 
 * @param {String} search 
 * @param {Array} params 
 * 
 * @return {Promise}
 */
export function search(search, params = []) {
    let url = servicePointsUrl;
    let subject = servicePoints;
    let propertyKey = 'servicePoints';

    if (search === 'carriers') {
        url = carriersUrl;
        subject = carrierData;
        propertyKey = 'delivery_services';
    }

    let filters = params.map(createFilter).join('%');

    return Axios.get(`${url}?${filters}`)
        .then(res => {
            const data = res.data._embedded[propertyKey] || [];

            if (data.length === 0) {
                Promise.reject(new Error('No data!'));
            }

            subject.next(data);
            return data;
        })
        .catch(err => {
            commitError(err.message);
        });
}
