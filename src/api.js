import { DAILY_COVID_DATA, REGIONAL_COVID_DATA } from './consts';

export const apiUrls = {
    DAILY_COVID_DATA: 'https://data.gov.rs/api/1/datasets/covid-19-dnevni-izveshtaj-o-epidemioloshkoj-situatsiji-u-republitsi-srbiji/',
    REGIONAL_COVID_DATA: 'https://data.gov.rs/api/1/datasets/covid-19-dnevni-izveshtaj-instituta-za-javno-zdravlje-srbije-o-zarazhenim-litsima-na-teritoriji-republike-srbije/',
    COVID_AMBULANCES: 'https://data.gov.rs/api/1/datasets/covid-19-registar-covid-19-ambulanti-na-teritoriji-republike-srbije/',
    SELF_ISOLATION: 'https://data.gov.rs/api/1/datasets/covid-19-dnevni-izveshtaj-o-obaveznoj-samoizolatsiji-na-teritoriji-republike-srbije/'
}

// const token = 'eyJhbGciOiJIUzUxMiJ9.eyJ1c2VyIjoiNWZhYWQ0OWQ3ZGUyNzIxNWUyNmI1M2FlIiwidGltZSI6MTYwNTAzMTE1Ny43MDE4MDZ9.rJoZSwentYLcZ6CzCxLBnNN07f-qibOhpXmkKJYu3S0W2Git8cU_DPh8g-YxTOUhWxu-ElVnCmtmGK1Pzzgsew';

// export const headers = new Headers();

// headers.append('Content-Type', 'text/plain');
// headers.append('Accept', 'text/plain');
// headers.append('Access-Control-Allow-Origin', '*');
// headers.append('Access-Control-Expose-Headers', 'true');
// headers.append('Authorization', `Bearer ${token}`);