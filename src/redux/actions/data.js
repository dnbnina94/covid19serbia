import { apiUrls } from '../../api';
import { 
    FETCHED_DATA, 
    FETCHING_DATA, 
    FETCHING_DATA_FAILED,
    REGIONAL_COVID_DATA,
    DAILY_COVID_DATA,
    COVID_AMBULANCES,
    SELF_ISOLATION
} from '../../consts';
import $ from 'jquery';
import { menuClosed } from "./ui";
const sifarnikOpstina = require('../../sifarnik-opstina.json');
const sifarnikOkruga = require('../../sifarnik-okruga.json');
const sifarnikMesta = require('../../sifarnik-mesta.json');
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

const ambulanceDataCorrections = [
    {
        targetKey: "district",
        targetValue: "BABUŠNICA",
        criteria: (d) => {
            return d.district === "BABUSNICA"
        }
    },
    {
        targetKey: "coordinates",
        targetValue: [22.321380947971456, 43.2180466593174],
        criteria: (d) => {
            return d.name === "DOM ZDRAVLJA BELA PALANKA"
        }
    },
    {
        targetKey: "coordinates",
        targetValue: [20.876648550775435, 43.64752935901642],
        criteria: (d) => {
            return d.name === "DOM ZDRAVLJA VRNJAČKA BANJA"
        }
    }
];

const parseData = (data, url) => {
    let parsedData = [];

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
        case COVID_AMBULANCES: {
            parsedData = data.map(d => {
                return {
                    name: d.COVID_ambulanta_pri_zdravstvenoj_ustanovi,
                    address: d.Adresa,
                    addressNumber: d.Broj_zgrade,
                    district: d["Grad/opština"],
                    phone: d.Kontakt_telefon,
                    mobile: d.Mobilni_telefon,
                    hoursWorkdays: `${d.Radni_dan_radno_vreme_od}-${d.Radni_dan_radno_vreme_do}`,
                    hoursWeekend: `${d.Vikend_radno_vreme_od}-${d.Vikend_radno_vreme_do}`,
                    coordinates: [+d.Geo_Longitude, +d.Geo_Latitude]
                }
            });

            ambulanceDataCorrections.forEach(m => {
                const pd = parsedData.filter(d => m.criteria(d));
                pd.forEach(d => {
                    d[m.targetKey] = m.targetValue;
                })
            });

            parsedData = parsedData.map(d => {
                let desc = d.district.toLowerCase();
                let opstina = sifarnikOpstina.find(s => {
                    return s.OpstinaNazivLat.toLowerCase() === desc;
                });
                if (!opstina) {
                    opstina = sifarnikOpstina.find(s => {
                        return s.OpstinaNazivLat.toLowerCase().includes(desc);
                    });
                }
                if (!opstina) {
                    let mesto = sifarnikMesta.find(s => {
                        return s.NazivMestaLatinicni.toLowerCase() === desc;
                    });
                    if (!mesto) {
                        mesto = sifarnikMesta.find(s => {
                            return s.NazivMestaLatinicni.toLowerCase().includes(desc);
                        });
                    }
                    if (mesto) {
                        opstina = sifarnikOpstina.find(s => {
                            return mesto.SifraOpstine === s.OpstinaSifra;
                        });
                    }
                }
                let okrug = null;
                if (opstina) {
                    okrug = sifarnikOkruga.find(s => s.OkrugSifra === opstina.OkrugSifra);
                    okrug = okrug.OkrugNazivLat.replace(' okrug', '');
                }
                return {
                    ...d,
                    region: okrug
                }
            });

            break;
        }
        case SELF_ISOLATION: {
            data = data.filter(d => d.IDTeritorije !== "RS");
            const territories = new Set(data.map(item => item.IDTeritorije));

            territories.forEach(item => {
                let district = sifarnikOpstina.find(s => s.OpstinaSifra === +item);
                let region;

                if (district) {
                    region = sifarnikOkruga.find(s => s.OkrugSifra === district.OkrugSifra);
                } else {
                    const territory = data.find(d => d.IDTeritorije === item);
                    if (territory.NazivTeritorije === "BEOGRAD") {
                        region = sifarnikOkruga.find(s => s.OkrugNazivLat.toLowerCase().includes(territory.NazivTeritorije.toLowerCase()));
                    } else {
                        const city = sifarnikMesta.find(s => s.NazivMestaLatinicni.toLowerCase() === territory.NazivTeritorije.toLowerCase());
                        district = sifarnikOpstina.find(s => s.OpstinaSifra === city.SifraOpstine);
                        region = sifarnikOkruga.find(s => s.OkrugSifra === district.OkrugSifra);
                    }
                }

                parsedData.push({
                    description: district ? district.OpstinaNazivLat : region.OkrugNazivLat,
                    region: region && region.OkrugNazivLat.replace(' okrug', ''),
                    district: district ? district.OpstinaNazivLat : '',
                    data: data.filter(d => d.IDTeritorije === item).map(d => {
                        return {
                            date: `${d.Godina}-${d.Mesec}-${d.Dan}`,
                            value: d.Vrednost
                        }
                    })
                });
            });

            break;
        }
    }

    return parsedData;
}

export const fetchingDataHandler = (dataType) => {
    let dataInfo;
    return function(dispatch) {

        dispatch(fetchingData());

        fetch(apiUrls[dataType], {
            method: 'GET',
            // headers: headers
        })
        .then(response => response.json())
        .then(data => {
            const res = data.resources.find(r => r.format === "txt");
            dataInfo = res;
            return fetch(res.latest, {
                method: 'GET',
                // headers: headers
            })
        })
        .then(response => response.text())
        .then(data => {
            data = $.csv.toObjects(data.replaceAll('"', ''));
            data = parseData(data, dataType);

            dispatch(fetchedData({
                dataType: dataType,
                data: {
                    data: data,
                    dataInfo: dataInfo
                }
            }));
        });
    }
}