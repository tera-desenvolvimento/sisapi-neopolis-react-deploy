import React, { useState } from "react";
import DateSelector from "../components/DateSelector";
import { doLogout, getCookies } from "../controllers/user/authenticate.controller";
import createTransport from "../controllers/transports/createTransport.controller";
import listTransports from "../controllers/transports/listTransports.controller";
import listDestinations from "../controllers/transports/listDestinations.controller";
import listDrivers from "../controllers/transports/listDrivers.controller";
import listVehicles from "../controllers/transports/listVehicles.controller";
import addPatient from "../controllers/transports/addPatient.controller";
import updateTrip from "../controllers/transports/updateTrip.controller";

import logoutIcon from "../img/logout.svg";
import logoNeopolis from "../img/logo-01.svg";
import wppIcon from "../img/wpp-icon.svg";
import excludeIcon from "../img/exclude-icon.svg";
import addRowIcon from "../img/add-row.svg";

import "../style/transports.css";

type Patient = {
    name: string;
    docId: string;
    phone: string;
    address: string;
    pickupLocation: string;
    destination: string;
}

type Transport = {
    date: string;
    exitTime: string;
    restTime: string;
    returnTime: string;
    arriveTime: string;
    destination: string;
    vehicleId: string;
    driverId: string;
    patients: Patient[];
    _id: string;
};

type Destination = {
    location: string;
    _id: string;
}

type Driver = {
    name: string;
    nickName: string;
    docId: string;
    _id: string;
}

type Vehicle = {
    description: string;
    plate: string;
    inspectionStatus: boolean;
    inspectionDetails: string;
    _id: string;
}

function TransportsPanel() {
    const userData = getCookies("userData");
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [transports, setTransports] = useState<Transport[]>([]);
    const [destinations, setDestinations] = useState<Destination[]>([]);
    const [drivers, setDrivers] = useState<Driver[]>([]);
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [newPatientData, setNewPatientData] = useState({} as Patient);

    window.onload = () => {
        listTransports(selectedDate.toLocaleDateString())
            .then(data => {
                setTransports(data.trips);
                console.log("Transports data:", transports);
            })
            .catch(error => {
                console.error(error);
            });

        listDestinations()
            .then(data => {
                setDestinations(data.tripDestinations);
                console.log("Destinations data:", data);
            })
            .catch(error => {
                console.error(error);
            });

        listDrivers()
            .then(data => {
                setDrivers(data.drivers);
                console.log("Drivers data:", data);
            })
            .catch(error => {
                console.error(error);
            });

        listVehicles()
            .then(data => {
                setVehicles(data);
                console.log("Vehicles data:", data);
            })
            .catch(error => {
                console.error(error);
            });
    }

    function handleDateChange(date: Date) {
        setSelectedDate(date);
        
        listTransports(selectedDate.toLocaleDateString())
            .then(data => {
                setTransports(data.trips);
                console.log("Transports data:", transports);
            })
            .catch(error => {
                console.error(error);
            });
    }

    function nextTransport() {
        const currentIndex = document.querySelector(".transport-element.active")?.getAttribute("data-index");
        if (currentIndex) {
            const nextIndex = parseInt(currentIndex) + 1;
            const nextTransportElement = document.getElementById(`transport-${nextIndex}`);
            if (nextTransportElement) {
                document.querySelectorAll(".transport-element").forEach(element => {
                    element.classList.remove("active");
                });
                nextTransportElement.classList.add("active");
                nextTransportElement.scrollIntoView({ behavior: "smooth", inline: "center" });
            }
        }
    }

    function prevTransport() {
        const currentIndex = document.querySelector(".transport-element.active")?.getAttribute("data-index");
        if (currentIndex) {
            const prevIndex = parseInt(currentIndex) - 1;
            const prevTransportElement = document.getElementById(`transport-${prevIndex}`);
            if (prevTransportElement) {
                document.querySelectorAll(".transport-element").forEach(element => {
                    element.classList.remove("active");
                });
                prevTransportElement.classList.add("active");
                prevTransportElement.scrollIntoView({ behavior: "smooth", inline: "center" });
            }
        }
    }

    function toggleNewPatientContainer(event: React.MouseEvent<HTMLButtonElement>) {
        const container = document.getElementById("newPacientContainer");
        if (container) {
            container.classList.toggle("hidden");
            container.dataset.transportId = event.currentTarget.dataset.transportId || "";
        }
    }

    function handleNewPatientChange(event: React.ChangeEvent<HTMLInputElement>) {
        setNewPatientData({
            ...newPatientData,
            [event.target.name]: event.target.value
        });
    }

    async function handleNewPatientSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (event) {
            var transportId = event.currentTarget.parentElement?.parentElement?.dataset.transportId || "";

            addPatient(transportId, newPatientData)
                .then(data => {
                    transports.forEach(transport => {
                        if (transport._id === transportId) {
                            listTransports(selectedDate.toLocaleDateString())
                                .then(data => {
                                    setTransports(data.trips);
                                    console.log("Transports data:", transports);
                                });
                        }
                    });

                    const container = document.getElementById("newPacientContainer");
                    if (container) {
                        container.classList.add("hidden");
                    }
                })
        }
    }

    async function handleUpdateTrip(event: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) {
        const transportId = event.currentTarget.dataset.transportId || "";
        const updates = {
            [event.target.name]: event.target.value
        };

        try {
            await updateTrip(transportId, updates);

            listTransports(selectedDate.toLocaleDateString())
                .then(data => {
                    setTransports(data.trips);
                    console.log("Transports data:", transports);
                });
        } catch (error) {
            console.error("Error updating trip:", error);
        }
    }

    function handleDeletePatient(event: React.MouseEvent<HTMLButtonElement>) {
        const transportId = event.currentTarget.dataset.transportId || "";
        const patientIndex = event.currentTarget.dataset.patientIndex || "";

        if (transportId && patientIndex) {
            transports.forEach(async transport => {
                if (transport._id === transportId) {
                    transport.patients.splice(parseInt(patientIndex), 1);
                }

                await updateTrip(transportId, { patients: transport.patients });

                listTransports(selectedDate.toLocaleDateString())
                    .then(data => {
                        setTransports(data.trips);
                        console.log("Transports data:", transports);
                    });
            });
        }
    }

    async function handleCreateTransport() {
        try {
            const newTransport = await createTransport(selectedDate.toLocaleDateString());
            setTransports([...transports, newTransport.trip]);
        } catch (error) {
            console.error("Error creating transport:", error);
        }
    }

    return (
        <React.Fragment>
            <div className="main-container">
                <DateSelector value={selectedDate} onChange={handleDateChange} />

                {
                    transports.length <= 0 ? (
                        <div className="new-transport" id="new-transport">
                            <button onClick={handleCreateTransport}>
                                <svg width="115" height="115" viewBox="0 0 115 115" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M97.3266 74.305L74.2974 74.297L74.3054 97.3262C74.3054 101.828 72.5171 106.145 69.3338 109.329C66.1506 112.512 61.8332 114.3 57.3314 114.3C52.8296 114.3 48.5123 112.512 45.329 109.329C42.1458 106.145 40.3575 101.828 40.3575 97.3263L40.3655 74.297L17.3362 74.305C12.8344 74.305 8.51706 72.5167 5.33383 69.3335C2.15059 66.1502 0.362263 61.8328 0.362263 57.3311C0.362264 52.8293 2.15059 48.5119 5.33383 45.3286C8.51706 42.1454 12.8345 40.3571 17.3362 40.3571L40.3655 40.3651L40.3575 17.3359C40.3575 12.8341 42.1458 8.51669 45.329 5.33346C48.5123 2.15022 52.8296 0.361903 57.3314 0.361903C61.8332 0.361902 66.1506 2.15022 69.3338 5.33346C72.5171 8.51669 74.3054 12.8341 74.3054 17.3359L74.2974 40.3651L97.3266 40.3571C99.5557 40.3571 101.763 40.7961 103.822 41.6492C105.882 42.5022 107.753 43.7525 109.329 45.3286C110.905 46.9048 112.155 48.776 113.009 50.8354C113.862 52.8948 114.301 55.102 114.301 57.3311C114.301 59.5601 113.862 61.7673 113.009 63.8267C112.155 65.8861 110.905 67.7573 109.329 69.3335C107.753 70.9096 105.882 72.1599 103.822 73.0129C101.763 73.866 99.5557 74.305 97.3266 74.305Z" fill="white"/>
                                </svg>
                            </button>
                            <label htmlFor="new-transport">Cadastrar transporte</label>
                        </div>
                    ) : (
                        <div className="transports-container" id="transports-container">
                            <div className="transports-swiper">
                                {
                                    transports.map((transport, index) => (
                                        <div className={`transport-element ${index === 0 ? 'active' : ''}`} id={`transport-${index}`} data-index={index} data-transport-id={transport._id}>
                                            <div className="transport-header">
                                                <div className="general-data-wrapper">
                                                    <div className="line">
                                                        <div className="separator">
                                                            <span>Destino:</span>
                                                            <select name="destination" id="destination" data-transport-id={transport._id} onChange={handleUpdateTrip} value={transport.destination}>
                                                                <option value="">Selecione o destino</option>
                                                                {
                                                                    destinations.map(dest => (
                                                                        <option value={dest.location} key={dest._id} selected={dest._id === transport.destination}>{dest.location}</option>
                                                                    ))
                                                                }
                                                            </select>
                                                            <button id="add-destination">
                                                                <svg width="10" height="10" viewBox="0 0 115 115" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                    <path d="M97.3266 74.305L74.2974 74.297L74.3054 97.3262C74.3054 101.828 72.5171 106.145 69.3338 109.329C66.1506 112.512 61.8332 114.3 57.3314 114.3C52.8296 114.3 48.5123 112.512 45.329 109.329C42.1458 106.145 40.3575 101.828 40.3575 97.3263L40.3655 74.297L17.3362 74.305C12.8344 74.305 8.51706 72.5167 5.33383 69.3335C2.15059 66.1502 0.362263 61.8328 0.362263 57.3311C0.362264 52.8293 2.15059 48.5119 5.33383 45.3286C8.51706 42.1454 12.8345 40.3571 17.3362 40.3571L40.3655 40.3651L40.3575 17.3359C40.3575 12.8341 42.1458 8.51669 45.329 5.33346C48.5123 2.15022 52.8296 0.361903 57.3314 0.361903C61.8332 0.361902 66.1506 2.15022 69.3338 5.33346C72.5171 8.51669 74.3054 12.8341 74.3054 17.3359L74.2974 40.3651L97.3266 40.3571C99.5557 40.3571 101.763 40.7961 103.822 41.6492C105.882 42.5022 107.753 43.7525 109.329 45.3286C110.905 46.9048 112.155 48.776 113.009 50.8354C113.862 52.8948 114.301 55.102 114.301 57.3311C114.301 59.5601 113.862 61.7673 113.009 63.8267C112.155 65.8861 110.905 67.7573 109.329 69.3335C107.753 70.9096 105.882 72.1599 103.822 73.0129C101.763 73.866 99.5557 74.305 97.3266 74.305Z" fill="white"/>
                                                                </svg>
                                                            </button>
                                                        </div>
                                                        <div className="separator">
                                                            <span>Veículo:</span>
                                                            <select name="vehicleId" id="vehicle" data-transport-id={transport._id} onChange={handleUpdateTrip} value={transport.vehicleId}>
                                                                <option value="">Selecione o veículo</option>
                                                                {
                                                                    vehicles.map(vehicle => (
                                                                        <option key={vehicle._id} value={vehicle._id} selected={vehicle._id === transport.vehicleId}> {vehicle.description} ({vehicle.plate}) </option>
                                                                    ))
                                                                }
                                                            </select>
                                                            <button id="add-vehicle">
                                                                <svg width="10" height="10" viewBox="0 0 115 115" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                    <path d="M97.3266 74.305L74.2974 74.297L74.3054 97.3262C74.3054 101.828 72.5171 106.145 69.3338 109.329C66.1506 112.512 61.8332 114.3 57.3314 114.3C52.8296 114.3 48.5123 112.512 45.329 109.329C42.1458 106.145 40.3575 101.828 40.3575 97.3263L40.3655 74.297L17.3362 74.305C12.8344 74.305 8.51706 72.5167 5.33383 69.3335C2.15059 66.1502 0.362263 61.8328 0.362263 57.3311C0.362264 52.8293 2.15059 48.5119 5.33383 45.3286C8.51706 42.1454 12.8345 40.3571 17.3362 40.3571L40.3655 40.3651L40.3575 17.3359C40.3575 12.8341 42.1458 8.51669 45.329 5.33346C48.5123 2.15022 52.8296 0.361903 57.3314 0.361903C61.8332 0.361902 66.1506 2.15022 69.3338 5.33346C72.5171 8.51669 74.3054 12.8341 74.3054 17.3359L74.2974 40.3651L97.3266 40.3571C99.5557 40.3571 101.763 40.7961 103.822 41.6492C105.882 42.5022 107.753 43.7525 109.329 45.3286C110.905 46.9048 112.155 48.776 113.009 50.8354C113.862 52.8948 114.301 55.102 114.301 57.3311C114.301 59.5601 113.862 61.7673 113.009 63.8267C112.155 65.8861 110.905 67.7573 109.329 69.3335C107.753 70.9096 105.882 72.1599 103.822 73.0129C101.763 73.866 99.5557 74.305 97.3266 74.305Z" fill="white"/>
                                                                </svg>
                                                            </button>
                                                        </div>
                                                        <div className="separator">
                                                            <span>Motorista:</span>
                                                            <select name="driverId" id="driver" data-transport-id={transport._id} onChange={handleUpdateTrip} value={transport.driverId}>
                                                                <option value="">Selecione o motorista</option>
                                                                {
                                                                    drivers.map(driver => (
                                                                        <option key={driver._id} value={driver._id}> {driver.name} ({driver.nickName}) </option>
                                                                    ))
                                                                }
                                                            </select>
                                                            <button id="add-driver">
                                                                <svg width="10" height="10" viewBox="0 0 115 115" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                    <path d="M97.3266 74.305L74.2974 74.297L74.3054 97.3262C74.3054 101.828 72.5171 106.145 69.3338 109.329C66.1506 112.512 61.8332 114.3 57.3314 114.3C52.8296 114.3 48.5123 112.512 45.329 109.329C42.1458 106.145 40.3575 101.828 40.3575 97.3263L40.3655 74.297L17.3362 74.305C12.8344 74.305 8.51706 72.5167 5.33383 69.3335C2.15059 66.1502 0.362263 61.8328 0.362263 57.3311C0.362264 52.8293 2.15059 48.5119 5.33383 45.3286C8.51706 42.1454 12.8345 40.3571 17.3362 40.3571L40.3655 40.3651L40.3575 17.3359C40.3575 12.8341 42.1458 8.51669 45.329 5.33346C48.5123 2.15022 52.8296 0.361903 57.3314 0.361903C61.8332 0.361902 66.1506 2.15022 69.3338 5.33346C72.5171 8.51669 74.3054 12.8341 74.3054 17.3359L74.2974 40.3651L97.3266 40.3571C99.5557 40.3571 101.763 40.7961 103.822 41.6492C105.882 42.5022 107.753 43.7525 109.329 45.3286C110.905 46.9048 112.155 48.776 113.009 50.8354C113.862 52.8948 114.301 55.102 114.301 57.3311C114.301 59.5601 113.862 61.7673 113.009 63.8267C112.155 65.8861 110.905 67.7573 109.329 69.3335C107.753 70.9096 105.882 72.1599 103.822 73.0129C101.763 73.866 99.5557 74.305 97.3266 74.305Z" fill="white"/>
                                                                </svg>
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <div className="line">
                                                        <div className="separator">
                                                            <span>Saída Neópolis:</span>
                                                            <input type="time" name="exitTime" id="exitTime" data-transport-id={transport._id} onChange={handleUpdateTrip} value={transport.exitTime} />
                                                        </div>
                                                        <div className="separator">
                                                            <span>Descanso:</span>
                                                            <input type="time" name="restTime" id="restTime" data-transport-id={transport._id} onChange={handleUpdateTrip} value={transport.restTime} />
                                                        </div>
                                                        <div className="separator">
                                                            <span>Saída Destino:</span>
                                                            <input type="time" name="returnTime" id="returnTime" data-transport-id={transport._id} onChange={handleUpdateTrip} value={transport.returnTime} />
                                                        </div>
                                                        <div className="separator">
                                                            <span>Chegada Neópolis:</span>
                                                            <input type="time" name="arriveTime" id="arriveTime" data-transport-id={transport._id} onChange={handleUpdateTrip} value={transport.arriveTime} />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="logo-wrapper">
                                                    <img src={logoNeopolis} alt="Logo Neópolis" />
                                                </div>
                                            </div>

                                            <div className="transport-body">
                                                <table className="transport-table">
                                                    <thead>
                                                        <tr>
                                                            <th></th>
                                                            <th>Paciente:</th>
                                                            <th>CPF:</th>
                                                            <th>Endereço:</th>
                                                            <th>Telefone:</th>
                                                            <th>Pegar em:</th>
                                                            <th>Destino:</th>
                                                            <th></th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {
                                                            transport.patients.map((patient, patientIndex) => (
                                                                <tr className="transport-row" key={patientIndex}>
                                                                    <td className="transport-index">{patientIndex + 1}</td>
                                                                    <td className="transport-info start">{patient.name}</td>
                                                                    <td className="transport-info">{patient.docId}</td>
                                                                    <td className="transport-info">{patient.address}</td>
                                                                    <td className="transport-info">{patient.phone}</td>
                                                                    <td className="transport-info">{patient.pickupLocation}</td>
                                                                    <td className="transport-info end">{patient.destination}</td>
                                                                    <td className="transport-actions">
                                                                        <button onClick={handleDeletePatient} data-transport-id={transport._id} data-patient-index={patientIndex}><img src={excludeIcon} alt="Excluir" /></button>
                                                                        <button><img src={wppIcon} alt="WhatsApp" /></button>
                                                                    </td>
                                                                </tr>
                                                            ))
                                                        }

                                                        {
                                                            transport.patients.length < 12 ? (
                                                                <tr className="transport-row">
                                                                    <td className="transport-index">{transport.patients.length + 1}</td>
                                                                    <td className="transport-info start"></td>
                                                                    <td className="transport-info"></td>
                                                                    <td className="transport-info"></td>
                                                                    <td className="transport-info"></td>
                                                                    <td className="transport-info"></td>
                                                                    <td className="transport-info end"></td>
                                                                    <td className="transport-actions"><button data-transport-id={transport._id} onClick={toggleNewPatientContainer}><img src={addRowIcon} alt="Adicionar" /></button></td>
                                                                </tr> 
                                                            ) : null
                                                        }

                                                        
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    ))
                                }

                                <div className="transport-element new-transport" id={`transport-${transports.length}`} data-index={transports.length}>
                                    <button onClick={handleCreateTransport}>
                                        <svg width="115" height="115" viewBox="0 0 115 115" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M97.3266 74.305L74.2974 74.297L74.3054 97.3262C74.3054 101.828 72.5171 106.145 69.3338 109.329C66.1506 112.512 61.8332 114.3 57.3314 114.3C52.8296 114.3 48.5123 112.512 45.329 109.329C42.1458 106.145 40.3575 101.828 40.3575 97.3263L40.3655 74.297L17.3362 74.305C12.8344 74.305 8.51706 72.5167 5.33383 69.3335C2.15059 66.1502 0.362263 61.8328 0.362263 57.3311C0.362264 52.8293 2.15059 48.5119 5.33383 45.3286C8.51706 42.1454 12.8345 40.3571 17.3362 40.3571L40.3655 40.3651L40.3575 17.3359C40.3575 12.8341 42.1458 8.51669 45.329 5.33346C48.5123 2.15022 52.8296 0.361903 57.3314 0.361903C61.8332 0.361902 66.1506 2.15022 69.3338 5.33346C72.5171 8.51669 74.3054 12.8341 74.3054 17.3359L74.2974 40.3651L97.3266 40.3571C99.5557 40.3571 101.763 40.7961 103.822 41.6492C105.882 42.5022 107.753 43.7525 109.329 45.3286C110.905 46.9048 112.155 48.776 113.009 50.8354C113.862 52.8948 114.301 55.102 114.301 57.3311C114.301 59.5601 113.862 61.7673 113.009 63.8267C112.155 65.8861 110.905 67.7573 109.329 69.3335C107.753 70.9096 105.882 72.1599 103.822 73.0129C101.763 73.866 99.5557 74.305 97.3266 74.305Z" fill="white"/>
                                        </svg>
                                    </button>
                                    <label htmlFor="new-transport">Adicionar transporte</label>
                                </div>
                            </div>
                            <div className="swipe-transport-controls">
                                <button onClick={prevTransport}>
                                    <svg width="40" height="40" viewBox="0 0 67 67" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <circle cx="33.5" cy="33.5" r="33.5" transform="rotate(-180 33.5 33.5)" fill="#0042C8"/>
                                        <path d="M37.2467 45.2681C37.4855 45.0359 37.675 44.7602 37.8042 44.4568C37.9335 44.1534 38 43.8282 38 43.4998C38 43.1713 37.9335 42.8461 37.8042 42.5427C37.675 42.2393 37.4855 41.9636 37.2467 41.7315L29.3918 34.0883C29.2312 33.932 29.141 33.7201 29.141 33.4991C29.141 33.2782 29.2312 33.0662 29.3918 32.91L37.2467 25.2685C37.7288 24.7997 37.9997 24.1638 37.9999 23.5007C38.0001 22.8377 37.7295 22.2017 37.2476 21.7327C36.7658 21.2637 36.1121 21.0002 35.4305 21C34.7489 20.9998 34.0952 21.2631 33.6131 21.7319L25.7564 29.375C25.1996 29.9167 24.7579 30.5598 24.4565 31.2675C24.1551 31.9753 24 32.7339 24 33.5C24 34.266 24.1551 35.0246 24.4565 35.7324C24.7579 36.4401 25.1996 37.0832 25.7564 37.6249L33.6131 45.2681C34.095 45.7367 34.7485 46 35.4299 46C36.1113 46 36.7648 45.7367 37.2467 45.2681Z" fill="#FFFAE6"/>
                                    </svg>

                                    Veículo Anterior
                                </button>
                                <button onClick={nextTransport}>
                                    Próximo Veículo

                                    <svg width="40" height="40" viewBox="0 0 67 67" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <circle cx="33.5" cy="33.5" r="33.5" fill="#0042C8"/>
                                        <path d="M29.7532 21.7319C29.5144 21.9641 29.325 22.2398 29.1958 22.5432C29.0665 22.8466 29 23.1718 29 23.5002C29 23.8287 29.0665 24.1539 29.1958 24.4573C29.325 24.7607 29.5145 25.0364 29.7532 25.2685L37.6082 32.9117C37.7688 33.068 37.859 33.2799 37.859 33.5009C37.859 33.7218 37.7688 33.9338 37.6082 34.09L29.7533 41.7315C29.2712 42.2003 29.0003 42.8362 29.0001 43.4993C28.9999 44.1623 29.2705 44.7983 29.7524 45.2673C30.2342 45.7363 30.8879 45.9998 31.5695 46C32.2511 46.0002 32.9048 45.7369 33.3869 45.2681L41.2436 37.625C41.8004 37.0833 42.2421 36.4402 42.5435 35.7325C42.8449 35.0247 43 34.2661 43 33.5C43 32.734 42.8449 31.9754 42.5435 31.2676C42.2421 30.5599 41.8004 29.9168 41.2436 29.3751L33.3869 21.7319C32.905 21.2633 32.2515 21 31.5701 21C30.8887 21 30.2352 21.2633 29.7532 21.7319Z" fill="#FFFAE6"/>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    )
                }

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

            <div className="new-exame-container hidden" id="newPacientContainer">
                <div className="new-exame-wrapper">
                    <div className="top-buttons-wrapper">
                        <button className="back" onClick={toggleNewPatientContainer}>
                            Voltar
                        </button>
                    </div>

                    <form className="new-exame-info" id="newPacientForm" onSubmit={handleNewPatientSubmit}>
                        <div className="form-wrapper">
                            <span>Nome Completo:</span>
                            <input type="text" name="name" id="patientNameEl" placeholder="Digite o nome do paciente" onChange={handleNewPatientChange}/>
                        </div>
                        <div className="form-wrapper">
                            <span>Endereço:</span>
                            <input type="text" name="address" id="addressEl" placeholder="Digite o endereço" onChange={handleNewPatientChange}/>
                        </div>
                        <div className="form-wrapper horizontal">
                            <div>
                                <span>CPF:</span>
                                <input type="text" name="docId" id="docIdEl" placeholder="Digite o CPF" onChange={handleNewPatientChange}/>
                            </div>
                            <div>
                                <span>Telefone:</span>
                                <input type="text" name="phone" id="patientPhoneEl" placeholder="Ex.: 557988888888" onChange={handleNewPatientChange}/>
                            </div>
                        </div>
                        <div className="form-wrapper">
                            <span>Pegar em:</span>
                            <input type="text" name="pickupLocation" id="pickupLocationEl" placeholder="Digite o local de retirada" onChange={handleNewPatientChange}/>
                        </div>
                        <div className="form-wrapper">
                            <span>Destino:</span>
                            <input type="text" name="destination" id="destinationEl" placeholder="Digite o destino" onChange={handleNewPatientChange}/>
                        </div>

                        <button type="submit" id="newExamSubmit">Cadastrar</button>
                    </form>
                </div>
            </div>

            <div className="pattern-rodape-light"></div>
        </React.Fragment>
    );
}

export default TransportsPanel;