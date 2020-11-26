import { apiUrls, headers  } from '../../api';
import { 
    FETCHED_DATA, 
    FETCHING_DATA, 
    FETCHING_DATA_FAILED,
    REGIONAL_COVID_DATA,
    DAILY_COVID_DATA
} from '../../consts';
import $ from 'jquery';
const sifarnikOpstina = require('../../sifarnik-opstina.json');
const sifarnikOkruga = require('../../sifarnik-okruga.json');
var csv  = $.csv = require('jquery-csv');

const fetchedData = (data) => {
    return {
        type: FETCHED_DATA,
        payload: data
    }
}

const fetchingData = () => {
    return {
        type: FETCHING_DATA
    }
}

const fetchingDataFailed = () => {
    return {
        type: FETCHING_DATA_FAILED
    }
}

const parseData = (data, url) => {
    const parsedData = [];

    switch(url) {
        case DAILY_COVID_DATA: {
            const flags = new Set(data.map(item => item.Opis));

            flags.forEach(flag => {
                parsedData.push({
                    description: flag,
                    data: data.filter(item => item.Opis === flag && item.Vrednost).map(item => {
                        return {
                            date: `${item.Godina}-${item.Mesec}-${item.Dan}`,
                            value: +item.Vrednost
                        }
                    })
                })
            });
            break;
        }
        case REGIONAL_COVID_DATA: {
            const flags = new Set(data.map(item => item.OPŠTINA));

            
            flags.forEach(flag => {

                let desc = flag.toLowerCase();
                let opstina = sifarnikOpstina.find(s => {
                    return s.OpstinaNazivLat.toLowerCase() === desc;
                });
                if (!opstina) {
                    opstina = sifarnikOpstina.find(s => {
                        return s.OpstinaNazivLat.toLowerCase().includes(desc);
                    });
                }
                let okrug = null;
                if (opstina) {
                    okrug = sifarnikOkruga.find(s => s.OkrugSifra === opstina.OkrugSifra);
                    okrug = okrug.OkrugNazivLat.replace(' okrug', '');
                }

                parsedData.push({
                    description: flag,
                    region: okrug,
                    district: opstina ? opstina.OpstinaNazivLat : null,
                    data: data.filter(item => item.OPŠTINA === flag).map(item => {
                        const sex = item.POL.toLowerCase();
                        return {
                            date: `${item.GODINA}-${item.MESEC}-${item.DAN}`,
                            sex: sex === 'ženski' ? 'F' : sex === 'muški' ? 'M' : 'U',
                            age: item.STAROST
                        }
                    })
                })
            });
            break;
        }
    }

    return parsedData;
}

export const fetchingDataHandler = (dataType) => {
    return function(dispatch) {
        fetch(apiUrls[dataType], {
            method: 'GET',
            headers: headers
        })
        .then(response => response.json())
        .then(data => {
            return fetch(data.latest, {
                method: 'GET',
                headers: headers
            })
        })
        .then(response => response.text())
        .then(data => {
            data = $.csv.toObjects(data);
            data = parseData(data, dataType);

            dispatch(fetchedData({
                dataType: dataType,
                data: data
            }))
        });
    }
}