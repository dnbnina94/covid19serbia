import { Component } from "react";

class Info extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="Info col-md-9 p-3 overflow-hidden main-page">
                <div className="row">
                <div className="col-md-12 mt-4 mb-4 my-md-0 d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center">
                    <p className="main-title font-headline">Informacije o projektu</p>
                </div>
                <div className="col-md-12 mt-md-2">
                    <p>
                        Projekat je realizovan u okviru master rada na Elektrotehničkom Fakultetu Univerziteta u Beogradu, smer Softversko Inženjerstvo. 
                        Cilj rada je demonstracija korišćenja novih veb tehnologija radi pružanja informativnog sadržaja i vizualizacije statističkih podataka 
                        o virusu COVID19 na teritoriji Republike Srbije.
                        Svi skupovi podataka preuzeti su sa <a href="https://data.gov.rs" target="_blank">Portala otvorenih podataka Republike Srbije</a>.
                    </p>
                    <br/>
                    <p>
                        <b>NAPOMENA: </b> 
                        Ovo nije zvanična stranica sa informacijama o COVID19 virusu. 
                        Zvanične informacije se mogu pronaći na&nbsp;
                        <a href="https://covid19.rs/" target="_blank">
                            www.covid19.rs
                        </a>
                    </p>
                    <br/>
                    <p>
                        Korišćeni su sledeći skupovi podataka:
                        <ul>
                            <li>
                                <a href="https://data.gov.rs/sr/datasets/covid-19-dnevni-izveshtaj-o-epidemioloshkoj-situatsiji-u-republitsi-srbiji/" target="_blank">
                                    COVID-19 – Dnevni izveštaj o epidemiološkoj situaciji u Republici Srbiji
                                </a>
                            </li>
                            <li>
                                <a href="https://data.gov.rs/sr/datasets/covid-19-dnevni-izveshtaj-instituta-za-javno-zdravlje-srbije-o-zarazhenim-litsima-na-teritoriji-republike-srbije/" target="_blank">
                                    COVID-19 – Dnevni izveštaj Instituta za javno zdravlje Srbije o zaraženim licima na teritoriji Republike Srbije
                                </a>
                            </li>
                            <li>
                                <a href="https://data.gov.rs/sr/datasets/covid-19-dnevni-izveshtaj-o-obaveznoj-samoizolatsiji-na-teritoriji-republike-srbije/" target="_blank">
                                    COVID-19 – Dnevni izveštaj o obaveznoj samoizolaciji na teritoriji Republike Srbije
                                </a>
                            </li>
                            <li>
                                <a href="https://data.gov.rs/sr/datasets/covid-19-registar-covid-19-ambulanti-na-teritoriji-republike-srbije/" target="_blank">
                                    COVID-19 – Registar COVID-19 ambulanti na teritoriji Republike Srbije
                                </a>
                            </li>
                        </ul>
                    </p>
                </div>
        </div>
            </div>
        )
    }
}

export default Info;