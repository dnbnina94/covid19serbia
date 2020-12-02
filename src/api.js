import { DAILY_COVID_DATA, REGIONAL_COVID_DATA } from './consts';

export const apiUrls = {
    DAILY_COVID_DATA: 'https://data.gov.rs/api/1/datasets/covid-19-dnevni-izveshtaj-o-epidemioloshkoj-situatsiji-u-republitsi-srbiji/resources/72ba62c1-a285-4e0e-b9eb-44211291c300/',
    REGIONAL_COVID_DATA: 'https://data.gov.rs/api/1/datasets/covid-19-dnevni-izveshtaj-instituta-za-javno-zdravlje-srbije-o-zarazhenim-litsima-na-teritoriji-republike-srbije/resources/758debd7-1af0-41b0-b3e5-96ba64151119/',
    COVID_AMBULANCES: 'https://data.gov.rs/api/1/datasets/covid-19-registar-covid-19-ambulanti-na-teritoriji-republike-srbije/resources/5d417939-57a3-4044-8fc2-da484d6dfcb3/'
}

export const GOOGLE_MAPS_API_KEY = 'AIzaSyBThMaQ5xP3OYFo9hOH1TOuL4vBdYCs-MU';

// const token = 'eyJhbGciOiJIUzUxMiJ9.eyJ1c2VyIjoiNWZhYWQ0OWQ3ZGUyNzIxNWUyNmI1M2FlIiwidGltZSI6MTYwNTAzMTE1Ny43MDE4MDZ9.rJoZSwentYLcZ6CzCxLBnNN07f-qibOhpXmkKJYu3S0W2Git8cU_DPh8g-YxTOUhWxu-ElVnCmtmGK1Pzzgsew';

export const headers = new Headers();

headers.append('Content-Type', 'text/plain');
headers.append('Accept', 'text/plain');
// headers.append('Access-Control-Allow-Origin', '*');
// headers.append('Access-Control-Expose-Headers', 'true');
// headers.append('Authorization', `Bearer ${token}`);