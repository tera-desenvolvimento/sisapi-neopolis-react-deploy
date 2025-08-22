import React, { useState } from "react";
import DateSelector from "../components/DateSelector";
import { doLogout, getCookies } from "../controllers/user/authenticate.controller";
import listTransports from "../controllers/transports/listTransports.controller"

import logoutIcon from "../img/logout.svg";
import logoNeopolis from "../img/logo-01.svg";

import "../style/transports.css";

function TransportsPanel() {
    const userData = getCookies("userData");
    const [selectedDate, setSelectedDate] = useState(new Date());

    function handleDateChange(date: Date) {
        setSelectedDate(date);
        console.log("Fetching transports for date:", date.toLocaleDateString('pt-BR'));
        listTransports(date.toLocaleDateString())
            .then(data => {
                console.log(data);
            })
            .catch(error => {
                console.error(error);
            });
    }

    return (
        <React.Fragment>
            <div className="main-container">
                <DateSelector value={selectedDate} onChange={handleDateChange} />

                <div className="new-transport hidden" id="new-transport">
                    <button>
                        <svg width="100" height="100" viewBox="0 0 115 115" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M97.3266 74.305L74.2974 74.297L74.3054 97.3262C74.3054 101.828 72.5171 106.145 69.3338 109.329C66.1506 112.512 61.8332 114.3 57.3314 114.3C52.8296 114.3 48.5123 112.512 45.329 109.329C42.1458 106.145 40.3575 101.828 40.3575 97.3263L40.3655 74.297L17.3362 74.305C12.8344 74.305 8.51706 72.5167 5.33383 69.3335C2.15059 66.1502 0.362263 61.8328 0.362263 57.3311C0.362264 52.8293 2.15059 48.5119 5.33383 45.3286C8.51706 42.1454 12.8345 40.3571 17.3362 40.3571L40.3655 40.3651L40.3575 17.3359C40.3575 12.8341 42.1458 8.51669 45.329 5.33346C48.5123 2.15022 52.8296 0.361903 57.3314 0.361903C61.8332 0.361902 66.1506 2.15022 69.3338 5.33346C72.5171 8.51669 74.3054 12.8341 74.3054 17.3359L74.2974 40.3651L97.3266 40.3571C99.5557 40.3571 101.763 40.7961 103.822 41.6492C105.882 42.5022 107.753 43.7525 109.329 45.3286C110.905 46.9048 112.155 48.776 113.009 50.8354C113.862 52.8948 114.301 55.102 114.301 57.3311C114.301 59.5601 113.862 61.7673 113.009 63.8267C112.155 65.8861 110.905 67.7573 109.329 69.3335C107.753 70.9096 105.882 72.1599 103.822 73.0129C101.763 73.866 99.5557 74.305 97.3266 74.305Z" fill="white"/>
                        </svg>
                    </button>
                    <label htmlFor="new-transport">Cadastrar transporte</label>
                </div>

                <div className="transports-container" id="transports-container">
                    <div className="transports-swiper">
                        <div className="transport-element">
                            <div className="transport-header">
                                <div className="general-data-wrapper">
                                    <div className="line">
                                        <div className="separator">
                                            <span>Destino:</span>
                                            <select name="destination" id="destination">
                                                <option value="destination1">Destino 1</option>
                                                <option value="destination2">Destino 2</option>
                                                <option value="destination3">Destino 3</option>
                                            </select>
                                            <button id="add-destination">
                                                <svg width="15" height="15" viewBox="0 0 115 115" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M97.3266 74.305L74.2974 74.297L74.3054 97.3262C74.3054 101.828 72.5171 106.145 69.3338 109.329C66.1506 112.512 61.8332 114.3 57.3314 114.3C52.8296 114.3 48.5123 112.512 45.329 109.329C42.1458 106.145 40.3575 101.828 40.3575 97.3263L40.3655 74.297L17.3362 74.305C12.8344 74.305 8.51706 72.5167 5.33383 69.3335C2.15059 66.1502 0.362263 61.8328 0.362263 57.3311C0.362264 52.8293 2.15059 48.5119 5.33383 45.3286C8.51706 42.1454 12.8345 40.3571 17.3362 40.3571L40.3655 40.3651L40.3575 17.3359C40.3575 12.8341 42.1458 8.51669 45.329 5.33346C48.5123 2.15022 52.8296 0.361903 57.3314 0.361903C61.8332 0.361902 66.1506 2.15022 69.3338 5.33346C72.5171 8.51669 74.3054 12.8341 74.3054 17.3359L74.2974 40.3651L97.3266 40.3571C99.5557 40.3571 101.763 40.7961 103.822 41.6492C105.882 42.5022 107.753 43.7525 109.329 45.3286C110.905 46.9048 112.155 48.776 113.009 50.8354C113.862 52.8948 114.301 55.102 114.301 57.3311C114.301 59.5601 113.862 61.7673 113.009 63.8267C112.155 65.8861 110.905 67.7573 109.329 69.3335C107.753 70.9096 105.882 72.1599 103.822 73.0129C101.763 73.866 99.5557 74.305 97.3266 74.305Z" fill="white"/>
                                                </svg>
                                            </button>
                                        </div>
                                        <div className="separator">
                                            <span>Veículo:</span>
                                            <select name="vehicle" id="vehicle">
                                                <option value="vehicle1">Veículo 1</option>
                                                <option value="vehicle2">Veículo 2</option>
                                                <option value="vehicle3">Veículo 3</option>
                                            </select>
                                            <button id="add-vehicle">
                                                <svg width="15" height="15" viewBox="0 0 115 115" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M97.3266 74.305L74.2974 74.297L74.3054 97.3262C74.3054 101.828 72.5171 106.145 69.3338 109.329C66.1506 112.512 61.8332 114.3 57.3314 114.3C52.8296 114.3 48.5123 112.512 45.329 109.329C42.1458 106.145 40.3575 101.828 40.3575 97.3263L40.3655 74.297L17.3362 74.305C12.8344 74.305 8.51706 72.5167 5.33383 69.3335C2.15059 66.1502 0.362263 61.8328 0.362263 57.3311C0.362264 52.8293 2.15059 48.5119 5.33383 45.3286C8.51706 42.1454 12.8345 40.3571 17.3362 40.3571L40.3655 40.3651L40.3575 17.3359C40.3575 12.8341 42.1458 8.51669 45.329 5.33346C48.5123 2.15022 52.8296 0.361903 57.3314 0.361903C61.8332 0.361902 66.1506 2.15022 69.3338 5.33346C72.5171 8.51669 74.3054 12.8341 74.3054 17.3359L74.2974 40.3651L97.3266 40.3571C99.5557 40.3571 101.763 40.7961 103.822 41.6492C105.882 42.5022 107.753 43.7525 109.329 45.3286C110.905 46.9048 112.155 48.776 113.009 50.8354C113.862 52.8948 114.301 55.102 114.301 57.3311C114.301 59.5601 113.862 61.7673 113.009 63.8267C112.155 65.8861 110.905 67.7573 109.329 69.3335C107.753 70.9096 105.882 72.1599 103.822 73.0129C101.763 73.866 99.5557 74.305 97.3266 74.305Z" fill="white"/>
                                                </svg>
                                            </button>
                                        </div>
                                        <div className="separator">
                                            <span>Motorista:</span>
                                            <select name="driver" id="driver">
                                                <option value="driver1">Motorista 1</option>
                                                <option value="driver2">Motorista 2</option>
                                                <option value="driver3">Motorista 3</option>
                                            </select>
                                            <button id="add-driver">
                                                <svg width="15" height="15" viewBox="0 0 115 115" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M97.3266 74.305L74.2974 74.297L74.3054 97.3262C74.3054 101.828 72.5171 106.145 69.3338 109.329C66.1506 112.512 61.8332 114.3 57.3314 114.3C52.8296 114.3 48.5123 112.512 45.329 109.329C42.1458 106.145 40.3575 101.828 40.3575 97.3263L40.3655 74.297L17.3362 74.305C12.8344 74.305 8.51706 72.5167 5.33383 69.3335C2.15059 66.1502 0.362263 61.8328 0.362263 57.3311C0.362264 52.8293 2.15059 48.5119 5.33383 45.3286C8.51706 42.1454 12.8345 40.3571 17.3362 40.3571L40.3655 40.3651L40.3575 17.3359C40.3575 12.8341 42.1458 8.51669 45.329 5.33346C48.5123 2.15022 52.8296 0.361903 57.3314 0.361903C61.8332 0.361902 66.1506 2.15022 69.3338 5.33346C72.5171 8.51669 74.3054 12.8341 74.3054 17.3359L74.2974 40.3651L97.3266 40.3571C99.5557 40.3571 101.763 40.7961 103.822 41.6492C105.882 42.5022 107.753 43.7525 109.329 45.3286C110.905 46.9048 112.155 48.776 113.009 50.8354C113.862 52.8948 114.301 55.102 114.301 57.3311C114.301 59.5601 113.862 61.7673 113.009 63.8267C112.155 65.8861 110.905 67.7573 109.329 69.3335C107.753 70.9096 105.882 72.1599 103.822 73.0129C101.763 73.866 99.5557 74.305 97.3266 74.305Z" fill="white"/>
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                    <div className="line">
                                        <div className="separator">
                                            <span>Horário previsto <br /> saída Neópolis:</span>
                                            <input type="time" name="departureTime" id="departureTime" />
                                        </div>
                                        <div className="separator">
                                            <span>Horário previsto <br /> de descanso:</span>
                                            <input type="time" name="restTime" id="restTime" />
                                        </div>
                                        <div className="separator">
                                            <span>Horário previsto <br /> saída do destino:</span>
                                            <input type="time" name="destinationDepartureTime" id="destinationDepartureTime" />
                                        </div>
                                        <div className="separator">
                                            <span>Horário previsto de <br /> chegada Neópolis:</span>
                                            <input type="time" name="destinationArrivalTime" id="destinationArrivalTime" />
                                        </div>
                                    </div>
                                </div>
                                <div className="logo-wrapper">
                                    <img src={logoNeopolis} alt="Logo Neópolis" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
            <div className="bottom-container">
                <div className="user-info-container">
                    <b id="user-name">{userData?.name}</b>
                    <button id="logout" onClick={doLogout}>  
                        <img src={logoutIcon} alt="Sair" />
                        Sair
                    </button>
                </div>

                <div className="buttons-container">
                </div>
            </div>
            <div className="pattern-rodape-light"></div>
        </React.Fragment>
    );
}

export default TransportsPanel;