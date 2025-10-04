import React, {useState} from "react";

import MainHeader from "../components/MainHeader";
import DateSelector from "../components/DateSelector";

import createTransport from "../controllers/transports/createTransport.controller";
import listTransports from "../controllers/transports/listTransports.controller";
import removeTransport from "../controllers/transports/removeTransport.controller";
import listDestinations from "../controllers/transports/listDestinations.controller";
import listDrivers from "../controllers/transports/listDrivers.controller";
import listVehicles from "../controllers/transports/listVehicles.controller";
import addPatient from "../controllers/transports/addPatient.controller";
import updateTrip from "../controllers/transports/updateTrip.controller";
import addDestination from "../controllers/transports/addDestination.controller";
import removeDestination from "../controllers/transports/removeDestination.controller";
import addVehicle from "../controllers/transports/addVehicle.controller";
import removeVehicle from "../controllers/transports/removeVehicle.controller";
import addDriver from "../controllers/transports/addDriver.controller";
import removeDriver from "../controllers/transports/removeDriver.controller";
import notifyPatient from "../controllers/transports/notifyPatient.controller";
import printCoupon from "../controllers/transports/printCoupon.controller";

import "../style/newTrasports.css";

type Patient = {
    name: string;
    docId: string;
    phone: string;
    address: string;
    pickupLocation: string;
    destination: string;
    notified: boolean;
    printed: boolean;
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
    docId: string;
    _id: string;
}

type CDriver = {
    name: string;
    docId: string;
}

type Vehicle = {
    description: string;
    plate: string;
    inspectionStatus: boolean;
    inspectionDetails: string;
    _id: string;
}

type CVehicle = {
    description: string;
    plate: string;
    inspectionStatus: boolean;
    inspectionDetails: string;
}

type modalData = {
    isError: boolean,
    message: string
}

function TransportsPanel() {
    const [asideMenuOpened, setAsideMenuOpened] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [isError, setIsError] = useState(false);
    const [modalErrorOpen, setModalErrorOpen] = useState(false);
    const [transports, setTransports] = useState<Transport[]>([]);
    const [destinations, setDestinations] = useState<Destination[]>([]);
    const [drivers, setDrivers] = useState<Driver[]>([]);
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [loaded, setLoaded] = useState(false);
    const [selectedTransportId, setSelectedTransportId] = useState("");
    const [newPatientData, setNewPatientData] = useState({} as Patient);
    const [hasAcompanhante, setHasAcompanhante] = useState(false);
    const [editPatientData, setEditPatientData] = useState({} as Patient);
    const [editPatientIndex, setEditPatientIndex] = useState(0);
    const [editPatientTransportId, setEditPatientTransportId] = useState("");
    const [location, setLocation] = useState("");
    const [newVehicleData, setNewVehicleData] = useState({} as CVehicle);
    const [newDriverData, setNewDriverData] = useState({} as CDriver);
    
    if (!loaded) {
        (function loadData() {
            listTransports(selectedDate.toLocaleDateString())
                .then(data => {
                    setTransports(data.trips);
                    if (data.trips.length) {
                        setSelectedTransportId(data.trips[0]._id);
                    }
                })
            .catch(error => {
                console.error(error);
            });

            listDestinations()
                .then(data => {
                    setDestinations(data.tripDestinations);
                })
                .catch(error => {
                    console.error(error);
                });

            listDrivers()
                .then(data => {
                    setDrivers(data.drivers);
                })
                .catch(error => {
                    console.error(error);
                });

            listVehicles()
                .then(data => {
                    setVehicles(data);
                })
                .catch(error => {
                    console.error(error);
                });

                setLoaded(true);
        })();
    }

    function handleModalMessage(data: modalData) {
        const isError = data.isError;
        const message = data.message;
        const messageElement = document.getElementById("warning-message") as HTMLSpanElement;

        setIsError(isError);
        messageElement.textContent = message;
        setModalErrorOpen(true);

        setTimeout(() => setModalErrorOpen(false), 10000);
    }

    function handleDateChange(date: Date) {
        setSelectedDate(date);
        
        listTransports(selectedDate.toLocaleDateString())
            .then(data => {
                setTransports(data.trips);
                if (data.trips.length) {
                    setSelectedTransportId(data.trips[0]._id);
                }
            })
            .catch(error => {
                console.error(error);
            });
    }

    function nextTransport() {
        const currentIndex = document.querySelector(".transport.active")?.getAttribute("data-index");
        if (currentIndex) {
            const nextIndex = parseInt(currentIndex) + 1;
            const nextTransportElement = document.getElementById(`transport-${nextIndex}`);
            if (nextTransportElement) {
                document.querySelectorAll(".transport").forEach(element => {
                    element.classList.remove("active");
                });
                nextTransportElement.classList.add("active");
                nextTransportElement.scrollIntoView({ behavior: "smooth", inline: "center" });

                setSelectedTransportId(nextTransportElement.dataset.transportId || "");
            }
        }
    }

    function prevTransport() {
        const currentIndex = document.querySelector(".transport.active")?.getAttribute("data-index");
        if (currentIndex) {
            const prevIndex = parseInt(currentIndex) - 1;
            const prevTransportElement = document.getElementById(`transport-${prevIndex}`);
            if (prevTransportElement) {
                document.querySelectorAll(".transport").forEach(element => {
                    element.classList.remove("active");
                });
                prevTransportElement.classList.add("active");
                prevTransportElement.scrollIntoView({ behavior: "smooth", inline: "center" });
                setSelectedTransportId(prevTransportElement.dataset.transportId || "");
            }
        }
    }
    
    function goPrint() {
        window.open(`/transportes/imprimir/${selectedTransportId}`, '_blank')?.focus();
    }

    async function handleCreateTransport() {
        try {
            const newTransport = await createTransport(selectedDate.toLocaleDateString());

            const updatedTransports = [...transports, newTransport.trip];
            setTransports(updatedTransports);

            setTimeout(() => {
                const realItems = Array.from(
                document.querySelectorAll<HTMLDivElement>(".listing-container.transport:not(.new)")
            );

            if (realItems.length === 0) return;

            realItems.forEach(el => el.classList.remove("active"));

            const id = newTransport?.trip?.id ?? newTransport?.trip?._id;
            const byId = id
                ? document.querySelector<HTMLDivElement>(
                    `.listing-container.transport:not(.new)[data-id="${id}"]`
                )
                : null;

            const target = byId ?? realItems[realItems.length - 1];

            target.classList.add("active");
            }, 50);
            
            document.querySelector(".listing-container.transport.new")?.classList.remove("active");

            handleModalMessage({
                isError: false,
                message: "Novo transporte adicionado com sucesso"
            })

        } catch (error) {
            console.error("Error creating transport:", error);
        }
    }

    function handleDeleteTransport(transportId: string) {
        removeTransport(transportId)
            .then(response => {
                if (response.message === "trip has patients") {
                    handleModalMessage({
                        isError: true,
                        message: "Não é possível remover transportes que contenham pacientes. Revise os dados e tente novamente!"
                    })
                } else {
                    const currentElement = document.querySelector(
                        `.listing-container.transport[data-id="${transportId}"]`
                    ) as HTMLDivElement | null;
                    const currentIndex = currentElement ? Number(currentElement.dataset.index) : -1;

                    listTransports(selectedDate.toLocaleDateString())
                        .then(data => {
                            setTransports(data.trips);

                            setTimeout(() => {
                                const elements = document.querySelectorAll(".listing-container.transport");

                                let targetIndex = currentIndex > 0 ? currentIndex - 1 : 0;

                                const target = elements[targetIndex] as HTMLDivElement | undefined;
                                if (target) {
                                    elements.forEach(el => el.classList.remove("active"));
                                    target.classList.add("active");
                                }

                                handleModalMessage({
                                    isError: false,
                                    message: "Transporte removido com sucesso"
                                })
                            }, 50);
                        })
                        .catch(err => console.error("Erro ao listar transportes:", err));
                }
            })
            .catch(error => {
                console.error("Error deleting transport:", error);
            });
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
                });
        } catch (error) {
            console.error("Error updating trip:", error);
        }
    }

    function toggleNewPatientContainer(event: React.MouseEvent<HTMLButtonElement>) {
        const container = document.getElementById("add-patient") as HTMLDivElement;
        const name = document.getElementById("newPatientNameEl") as HTMLInputElement;
        const address = document.getElementById("newAddressEl") as HTMLInputElement;
        const docId = document.getElementById("newDocIdEl") as HTMLInputElement;
        const phone = document.getElementById("newPatientPhoneEl") as HTMLInputElement;
        const pickupLocation = document.getElementById("newPickupLocationEl") as HTMLInputElement;
        const destination = document.getElementById("newDestinationEl") as HTMLInputElement;

        if (name) name.value = "";
        if (address) address.value = "";
        if (docId) docId.value = "";
        if (phone) phone.value = "";
        if (pickupLocation) pickupLocation.value = "";
        if (destination) destination.value = "";

        setNewPatientData({} as Patient);

        if (container) {
            container.classList.toggle("open");
            container.dataset.transportId = event.currentTarget.dataset.transportId || "";
        }
    }

    function handleNewPatientChange(event: React.ChangeEvent<HTMLInputElement>) {
        if (event.target.id === "newDocIdEl"){
            var docId = event.target.value;
            docId = docId.replace(/[^\d]/g, "");
            docId = docId.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");

            setNewPatientData({
                ...newPatientData,
                docId: docId
            });
        } else {
            setNewPatientData({
                ...newPatientData,
                [event.target.name]: event.target.value
            });
        }
    }

    function handleHasAcompanhante(event: React.ChangeEvent<HTMLInputElement>) {
        setHasAcompanhante(event.target.checked);
    }

    async function handleNewPatientSubmit() {
        const container = document.getElementById("add-patient") as HTMLDivElement;

        var transportId = container.dataset.transportId || "";

        if (newPatientData.address === "", newPatientData.destination === "", newPatientData.docId === "", newPatientData.name === "", newPatientData.phone === "", newPatientData.pickupLocation === "", !newPatientData.address, !newPatientData.destination, !newPatientData.docId, !newPatientData.name, !newPatientData.phone, !newPatientData.pickupLocation) {
            handleModalMessage({
                isError: true,
                message: "Preencha todos os dados do paciente para continuar"
            })
        } else {
            if (hasAcompanhante) {
                addPatient(transportId, newPatientData)
                    .then(() => {
                        let acompanhanteData = newPatientData;
                        acompanhanteData.name = "ACOMPANHANTE";

                        addPatient(transportId, acompanhanteData)
                            .then(data => {
                                setNewPatientData({} as Patient);
                                setHasAcompanhante(false);

                                transports.forEach(transport => {
                                    if (transport._id === transportId) {
                                        listTransports(selectedDate.toLocaleDateString())
                                            .then(data => {
                                                setTransports(data.trips);
                                            });
                                    }
                                });

                                if (container) {
                                    container.classList.remove("open");
                                    handleModalMessage({
                                        isError: false,
                                        message: "Paciente adicionado com sucesso"
                                    })
                                }
                            })
                    })

            } else {
                addPatient(transportId, newPatientData)
                    .then(data => {
                        setNewPatientData({} as Patient);

                        transports.forEach(transport => {
                            if (transport._id === transportId) {
                                listTransports(selectedDate.toLocaleDateString())
                                    .then(data => {
                                        setTransports(data.trips);
                                    });
                            }
                        });

                        if (container) {
                            container.classList.remove("open");
                        }
                    })
            }
        }

    }

    function toggleEditPatientContainer(event: React.MouseEvent<HTMLButtonElement>) {
        const transportId = event.currentTarget.dataset.transportId || "";
        const patientIndex = event.currentTarget.dataset.patientIndex || "";
        const container = document.getElementById("edit-patient");
        
        if (container) {
            container.classList.toggle("open");

            setEditPatientTransportId(transportId);
            setEditPatientIndex(patientIndex as unknown as number);

            const transport = transports.find(transport => transport._id === transportId);
            if (transport) {
                const patient = transport.patients[patientIndex as unknown as number];
                if (patient) {
                    setEditPatientData(patient);
                }
            }
        }
    }

    function handleEditPatientChange(event: React.ChangeEvent<HTMLInputElement>) {
        if (event.target.id === "editdocIdEl"){
            var docId = event.target.value;
            docId = docId.replace(/[^\d]/g, "");
            docId = docId.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");

            setEditPatientData({
                ...editPatientData,
                docId: docId
            });
        } else {
            setEditPatientData({
                ...editPatientData,
                [event.target.name]: event.target.value
            });
        }
    }

    function editPatientDataSubmit() {
        if (editPatientTransportId && editPatientIndex !== null) {
            const updatedTransports = transports.map(async transport => {
                if (transport._id === editPatientTransportId) {
                    const updatedPatients = [...transport.patients];
                    updatedPatients[editPatientIndex] = editPatientData;

                    const updates = {
                        patients: updatedPatients
                    };

                    try {
                        await updateTrip(editPatientTransportId, updates);

                        listTransports(selectedDate.toLocaleDateString())
                            .then(data => {
                                setTransports(data.trips);
                            });
                    } catch (error) {
                        console.error("Error updating trip:", error);
                    }
                }
            });

            setEditPatientTransportId("");
            setEditPatientIndex(0);
            setEditPatientData({} as Patient);

            const container = document.getElementById("edit-patient");
            if (container) {
                container.classList.toggle("open");
                handleModalMessage({
                    isError: false,
                    message: "Paciente alterado com sucesso"
                })
            }   
        }
    }

    function toggleNewDestinationContainer() {
        const container = document.getElementById("add-destination");
        if (container) {
            container.classList.toggle("open");
        }
    }

    function toggleNewVehicleContainer() {
        const container = document.getElementById("add-vehicle");
        if (container) {
            container.classList.toggle("open");
        }
    }

    function toggleNewDriverContainer() {
        const container = document.getElementById("add-driver");
        if (container) {
            container.classList.toggle("open");
        }
    }

    function handleSetDestination(event: React.ChangeEvent<HTMLInputElement>) {
        setLocation(event.target.value)
    }

    async function handleAddDestination() {
        try {
            const newDestination = await addDestination(location);
            setDestinations(prevDestinations => [...prevDestinations, newDestination.tripDestination]);

            toggleNewDestinationContainer();
        } catch (error) {
            console.error("Error adding destination:", error);
        }
    }
    
    async function handleRemoveDestination(event: React.MouseEvent<HTMLButtonElement>) {
        const destinationId = event.currentTarget.dataset.destinationId || "";

        try {
            await removeDestination(destinationId);
            setDestinations(destinations.filter(dest => dest._id !== destinationId));
        } catch (error) {
            console.error("Error removing destination:", error);
        }
    }

    function handleNewVehicleChange(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        const target = event.target as HTMLInputElement | HTMLTextAreaElement;
        const { name, value, type } = target;
        setNewVehicleData(prevState => ({
            ...prevState,
            [name]: type === "checkbox" && 'checked' in target ? (target as HTMLInputElement).checked : value
        }));
    }
    
    async function handleNewVehicleSubmit() {
        try {
            const response = await addVehicle(newVehicleData);

            setVehicles(prevVehicles => [...prevVehicles, response]);

            toggleNewVehicleContainer();

        } catch (error) {
            console.error("Error adding vehicle:", error);
        }
    }

    async function handleDeleteVehicle(event: React.MouseEvent<HTMLButtonElement>) {
        const vehicleId = event.currentTarget.dataset.vehicleId || "";

        try {
            await removeVehicle(vehicleId);
            setVehicles(vehicles.filter(veh => veh._id !== vehicleId));
        } catch (error) {
            console.error("Error removing vehicle:", error);
        }
    }

    function handleNewDriverChange(event: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target;
        setNewDriverData(prevState => ({
            ...prevState,
            [name]: value
        }));
    }

    async function handleAddDriver() {
        try {
            const newDriver = await addDriver(newDriverData);
            setDrivers([...drivers, newDriver.driver]);

            toggleNewDriverContainer();
        } catch (error) {
            console.error("Error adding driver:", error);
        }
    }

    async function handleDeleteDriver(event: React.MouseEvent<HTMLButtonElement>) {
        const driverId = event.currentTarget.dataset.driverId || "";

        try {
            await removeDriver(driverId);
            setDrivers(drivers.filter(driver => driver._id !== driverId));
        } catch (error) {
            console.error("Error removing driver:", error);
        }
    }

    async function handleNotifyPatient(event: React.MouseEvent<HTMLButtonElement>) {
        const tripId = event.currentTarget.dataset.tripId || "";
        const patientName = event.currentTarget.dataset.patientName || "";
        const patientNumber = event.currentTarget.dataset.patientNumber || "";
        const docId = event.currentTarget.dataset.docId;
        const destination = event.currentTarget.dataset.destination || "";
        const patientIndex = event.currentTarget.dataset.patientIndex || "";

        try {
            await notifyPatient(tripId, patientName, patientNumber, destination);
            const transport = transports.find(transport => transport._id === tripId);
            if (transport) {
                const patient = transport.patients[patientIndex as unknown as number];
                if (patient) {
                    patient.notified = true;
                }
            }

            updateTrip(tripId, {"patients": transport?.patients}).then(()=> {
                listTransports(selectedDate.toLocaleDateString())
                    .then(data => {
                        setTransports(data.trips);

                        handleModalMessage({
                            isError: false,
                            message: "Paciente notificado com sucesso"
                        })
                    })
                .catch(error => {
                    console.error(error);
                });
            })

        } catch (error) {
            console.error("Error notifying patient:", error);
        }
    }

    function handleDeletePatient(event: React.MouseEvent<HTMLButtonElement>) {
        const transportId = event.currentTarget.dataset.transportId || "";
        const patientIndex = event.currentTarget.dataset.patientIndex || "";

        if (transportId && patientIndex) {
            transports.forEach(async transport => {
                if (transport._id === transportId) {
                    transport.patients.splice(parseInt(patientIndex), 1);

                    await updateTrip(transportId, { patients: transport.patients });

                    listTransports(selectedDate.toLocaleDateString())
                        .then(data => {
                            setTransports(data.trips);
                        });
                }                
            });
        }
    }

    async function handlePrintCoupon(event: React.MouseEvent<HTMLButtonElement>) {
        const tripId = event.currentTarget.dataset.tripId || "";
        const docId = event.currentTarget.dataset.docId;
        const paciente = event.currentTarget.dataset.patientName || "";
        const dataViagem = event.currentTarget.dataset.transportDate || "";
        const horaViagem = event.currentTarget.dataset.transportHour || "";
        const destino = event.currentTarget.dataset.destination || "";
        const driverId = event.currentTarget.dataset.driverId || "";
        const patientIndex = event.currentTarget.dataset.patientIndex || "";
        var motorista = "";

        if (driverId === "vazio") {
            handleModalMessage({
                isError: true,
                message: "Motorista tem que estar selecionado"
            })
        } else {
            motorista = await drivers.filter(driver => driver._id === driverId)[0].name;

            await printCoupon(paciente, dataViagem, horaViagem, destino, motorista)
                .then(response => {
                    if (response && typeof response === "object" && "error" in response && (response as any).error) {
                        handleModalMessage({
                            isError: true,
                            message: "Erro ao imprimir cupom: " + (response as any).error
                        })
                    } else {
                        const transport = transports.find(transport => transport._id === tripId);
                        if (transport) {
                            const patient = transport.patients[patientIndex as unknown as number];
                            if (patient) {
                                patient.printed = true;
                            }
                        }

                        updateTrip(tripId, {"patients": transport?.patients}).then(()=> {
                            listTransports(selectedDate.toLocaleDateString())
                                .then(data => {
                                    setTransports(data.trips);
                                })
                            .catch(error => {
                                console.error(error);
                            });
                        })
                    }
                });
        }
    }

    return(
        <React.Fragment>
            <MainHeader/>
            <div className="main-transports-container">
                <div className={asideMenuOpened ? "menu-aside-container open" : "menu-aside-container"}>
                    <div className="menu-wrapper">
                        <div className="menu-item selected">
                            <a href="#">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" viewBox="0 0 14 16" fill="none">
                                    <path d="M10.8889 7.2H3.11111V8.8H10.8889V7.2ZM12.4444 1.6H11.6667V0H10.1111V1.6H3.88889V0H2.33333V1.6H1.55556C0.692222 1.6 0.00777777 2.32 0.00777777 3.2L0 14.4C0 15.28 0.692222 16 1.55556 16H12.4444C13.3 16 14 15.28 14 14.4V3.2C14 2.32 13.3 1.6 12.4444 1.6ZM12.4444 14.4H1.55556V5.6H12.4444V14.4ZM8.55556 10.4H3.11111V12H8.55556V10.4Z" fill="#333333"/>
                                </svg>

                                <span>Agendar Vagas</span>
                            </a>
                        </div>
                        <div className="menu-item">
                            <a href="/transportes/fixos">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                    <path d="M14.1511 1.01C13.9733 0.42 13.4756 0 12.8889 0H3.11111C2.52444 0 2.03556 0.42 1.84889 1.01L0.0977777 6.68C0.0355555 6.89 0 7.11 0 7.34V14.5C0 15.33 0.595556 16 1.33333 16C2.07111 16 2.66667 15.33 2.66667 14.5V14H13.3333V14.5C13.3333 15.32 13.9289 16 14.6667 16C15.3956 16 16 15.33 16 14.5V7.34C16 7.12 15.9644 6.89 15.9022 6.68L14.1511 1.01ZM3.11111 11C2.37333 11 1.77778 10.33 1.77778 9.5C1.77778 8.67 2.37333 8 3.11111 8C3.84889 8 4.44444 8.67 4.44444 9.5C4.44444 10.33 3.84889 11 3.11111 11ZM12.8889 11C12.1511 11 11.5556 10.33 11.5556 9.5C11.5556 8.67 12.1511 8 12.8889 8C13.6267 8 14.2222 8.67 14.2222 9.5C14.2222 10.33 13.6267 11 12.8889 11ZM1.77778 6L2.90667 2.18C3.03111 1.78 3.36889 1.5 3.75111 1.5H12.2489C12.6311 1.5 12.9689 1.78 13.0933 2.18L14.2222 6H1.77778Z" fill="#333333"/>
                                </svg>

                                <span>Agendamento de carros fixos</span>
                            </a>
                        </div>
                        <div className="menu-item">
                            <a href="/transportes/solicitacoes">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                    <path d="M11.96 6.55138L7.432 11.1837C7.12 11.5029 6.616 11.5029 6.304 11.1837L4.04 8.86754C3.728 8.54835 3.728 8.03274 4.04 7.71355C4.352 7.39436 4.856 7.39436 5.168 7.71355L6.864 9.44862L10.824 5.39739C11.136 5.0782 11.64 5.0782 11.952 5.39739C12.272 5.71658 12.272 6.23219 11.96 6.55138ZM1.6 8C1.6 6.09305 2.416 4.38253 3.696 3.18762L4.92 4.43982C5.168 4.69354 5.6 4.51348 5.6 4.14519V0.634114C5.6 0.404953 5.424 0.224898 5.2 0.224898H1.768C1.408 0.224898 1.232 0.666851 1.488 0.920565L2.56 2.02545C0.992 3.51499 0 5.63473 0 8C0 11.8876 2.656 15.1449 6.208 15.9797C6.712 16.0943 7.2 15.7096 7.2 15.1776C7.2 14.793 6.936 14.4656 6.568 14.3756C3.728 13.7127 1.6 11.11 1.6 8ZM16 8C16 4.11245 13.344 0.85509 9.792 0.0202898C9.288 -0.0942906 8.8 0.290372 8.8 0.822353C8.8 1.20702 9.064 1.53439 9.432 1.62442C12.272 2.28735 14.4 4.88996 14.4 8C14.4 9.90695 13.584 11.6175 12.304 12.8124L11.08 11.5602C10.832 11.3065 10.4 11.4865 10.4 11.8548V15.3659C10.4 15.595 10.576 15.7751 10.8 15.7751H14.232C14.592 15.7751 14.768 15.3331 14.512 15.0794L13.44 13.9746C15.008 12.485 16 10.3653 16 8Z" fill="#333333"/>
                                </svg>

                                <span>Aprovação Whatsapp</span>
                            </a>
                        </div>
                        <div className="menu-item">
                            <a href={window.location.origin + "/boletim-transportes.pdf"} target="_blank" rel="noopener noreferrer">
                                <svg width="20" height="18" viewBox="0 0 20 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M17 5H3C1.34 5 0 6.34 0 8V12C0 13.1 0.9 14 2 14H4V16C4 17.1 4.9 18 6 18H14C15.1 18 16 17.1 16 16V14H18C19.1 14 20 13.1 20 12V8C20 6.34 18.66 5 17 5ZM13 16H7C6.45 16 6 15.55 6 15V11H14V15C14 15.55 13.55 16 13 16ZM17 9C16.45 9 16 8.55 16 8C16 7.45 16.45 7 17 7C17.55 7 18 7.45 18 8C18 8.55 17.55 9 17 9ZM15 0H5C4.45 0 4 0.45 4 1V3C4 3.55 4.45 4 5 4H15C15.55 4 16 3.55 16 3V1C16 0.45 15.55 0 15 0Z" fill="#323232"/>
                                </svg>

                                <span>Imprimir relatório de inspeção</span>
                            </a>
                        </div>
                        <br />
                        <DateSelector value={selectedDate} onChange={handleDateChange} visible={asideMenuOpened} />
                    </div>
                    <div className="support-wrapper">
                        <div className="menu-wrapper">
                            <div className="menu-item">
                                <a href="#">
                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M6.88 7.94L7.41 8.47C7.7 8.76 8.18 8.76 8.47 8.47C8.76 8.18 8.76 7.7 8.47 7.41L7.59 6.53C7.2 6.14 6.57 6.14 6.18 6.53L5.29 7.41C5 7.7 5 8.18 5.29 8.47C5.58 8.76 6.06 8.76 6.35 8.47L6.88 7.94ZM10 15.5C12.03 15.5 13.8 14.39 14.75 12.75C14.94 12.42 14.7 12 14.31 12H5.69C5.31 12 5.06 12.42 5.25 12.75C6.2 14.39 7.97 15.5 10 15.5ZM11.53 8.47C11.82 8.76 12.3 8.76 12.59 8.47L13.12 7.94L13.65 8.47C13.94 8.76 14.42 8.76 14.71 8.47C15 8.18 15 7.7 14.71 7.41L13.83 6.53C13.44 6.14 12.81 6.14 12.42 6.53L11.54 7.41C11.24 7.7 11.24 8.18 11.53 8.47ZM9.99 0C4.47 0 0 4.47 0 10C0 15.53 4.47 20 9.99 20C15.51 20 20 15.53 20 10C20 4.47 15.52 0 9.99 0ZM10 18C5.58 18 2 14.42 2 10C2 5.58 5.58 2 10 2C14.42 2 18 5.58 18 10C18 14.42 14.42 18 10 18Z" fill="#333333"/>
                                    </svg>

                                    <span>Falar com suporte</span>
                                </a>
                            </div>
                        </div>
                    </div>
                    <button className={asideMenuOpened ? "close-menu open" : "close-menu"} onClick={() => setAsideMenuOpened(!asideMenuOpened)}>
                        {
                            asideMenuOpened ? <svg width="7" height="12" viewBox="0 0 7 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6.70753 2.5375L2.82753 6.4175L6.70753 10.2975C7.09753 10.6875 7.09753 11.3175 6.70753 11.7075C6.31753 12.0975 5.68753 12.0975 5.29753 11.7075L0.707531 7.1175C0.317531 6.7275 0.317531 6.0975 0.707531 5.7075L5.29753 1.1175C5.68753 0.727497 6.31753 0.727497 6.70753 1.1175C7.08753 1.5075 7.09753 2.1475 6.70753 2.5375Z" fill="#333333"/></svg> : <svg width="7" height="12" viewBox="0 0 7 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0.2925 9.4625L4.1725 5.5825L0.2925 1.7025C-0.0975 1.3125 -0.0975 0.6825 0.2925 0.2925C0.6825 -0.0975 1.3125 -0.0975 1.7025 0.2925L6.2925 4.8825C6.6825 5.2725 6.6825 5.9025 6.2925 6.2925L1.7025 10.8825C1.3125 11.2725 0.6825 11.2725 0.2925 10.8825C-0.0875 10.4925 -0.0975 9.8525 0.2925 9.4625Z" fill="#333333"/></svg>
                        }
                    </button>
                </div>
                <div className="content-container">
                    <div className="sub-header">
                        <div className="separator">
                            <div className="sub-category">
                                <b>Transportes </b>
                                <svg width="5" height="9" viewBox="0 0 5 9" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0.222096 7.62081L3.16819 4.49597L0.222096 1.37114C-0.0740319 1.05705 -0.0740319 0.549664 0.222096 0.23557C0.518223 -0.0785235 0.996583 -0.0785235 1.29271 0.23557L4.7779 3.93222C5.07403 4.24631 5.07403 4.75369 4.7779 5.06779L1.29271 8.76443C0.996583 9.07852 0.518223 9.07852 0.222096 8.76443C-0.0664389 8.45034 -0.0740319 7.9349 0.222096 7.62081Z" fill="#6B7280"/></svg>
                                <b> Agendamentos</b>
                            </div>
                            <span>Aqui você agenda os transportes.</span>
                        </div>
                        <div className="separator date">
                            <span>Data selecionada</span>
                            <b>{selectedDate.toLocaleDateString()}</b>
                        </div>
                    </div>
                    
                    <div className="transports-swiper">
                        {   transports.length ?
                            transports.map((transport, index) => (
                                <React.Fragment>
                                    <div className={`listing-container transport ${index === 0 ? 'active' : ''}`} id={`transport-${index}`} data-index={index} data-transport-id={transport._id} key={transport._id}>
                                        <div className="buttons-wrapper">
                                            <div className="separator">
                                                <div className="select-wrapper">
                                                    <span>Destino</span>
                                                    <div>
                                                        <select name="destination" id="destination" data-transport-id={transport._id} onChange={handleUpdateTrip} value={transport.destination}>
                                                            <option value="">Destino</option>
                                                            {
                                                                destinations.map(dest => (
                                                                    <option value={dest.location} key={dest._id}>{dest.location}</option>
                                                                ))
                                                            }
                                                        </select>
                                                        <button onClick={toggleNewDestinationContainer}>
                                                            <svg width="9" height="9" viewBox="0 0 9 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <path d="M4.1525 0.336234C3.89794 0.336234 3.69234 0.541839 3.69234 0.796398L3.68908 3.9849L0.497304 3.9849C0.242746 3.9849 0.0371407 4.19051 0.0371407 4.44507C0.0371408 4.69963 0.242746 4.90523 0.497304 4.90523L3.68908 4.90523L3.68908 8.097C3.68908 8.35156 3.89468 8.55717 4.14924 8.55717C4.4038 8.55717 4.6094 8.35156 4.6094 8.097L4.6094 4.90523L7.80117 4.90523C8.05573 4.90523 8.26134 4.69963 8.26134 4.44507C8.26134 4.19051 8.05573 3.9849 7.80117 3.9849L4.6094 3.9849L4.6094 0.793134C4.6094 0.545103 4.40053 0.336234 4.1525 0.336234V0.336234Z" fill="white"/>
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className="select-wrapper">
                                                    <span>Veículo</span>
                                                    <div>
                                                        <select name="vehicleId" id="vehicle" data-transport-id={transport._id} onChange={handleUpdateTrip} value={transport.vehicleId}>
                                                            <option value="">Veículo</option>
                                                            {
                                                                vehicles.map(vehicle => (
                                                                    <option key={vehicle._id} value={vehicle._id}> {vehicle.description} ({vehicle.plate}) </option>
                                                                ))
                                                            }
                                                        </select>
                                                        <button onClick={toggleNewVehicleContainer}>
                                                            <svg width="9" height="9" viewBox="0 0 9 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <path d="M4.1525 0.336234C3.89794 0.336234 3.69234 0.541839 3.69234 0.796398L3.68908 3.9849L0.497304 3.9849C0.242746 3.9849 0.0371407 4.19051 0.0371407 4.44507C0.0371408 4.69963 0.242746 4.90523 0.497304 4.90523L3.68908 4.90523L3.68908 8.097C3.68908 8.35156 3.89468 8.55717 4.14924 8.55717C4.4038 8.55717 4.6094 8.35156 4.6094 8.097L4.6094 4.90523L7.80117 4.90523C8.05573 4.90523 8.26134 4.69963 8.26134 4.44507C8.26134 4.19051 8.05573 3.9849 7.80117 3.9849L4.6094 3.9849L4.6094 0.793134C4.6094 0.545103 4.40053 0.336234 4.1525 0.336234V0.336234Z" fill="white"/>
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="select-wrapper">
                                                    <span>Motorista</span>
                                                    <div>
                                                        <select name="driverId" id="driver" data-transport-id={transport._id} onChange={handleUpdateTrip} value={transport.driverId}>
                                                            <option value="">Motorista</option>
                                                            {
                                                                drivers.map(driver => (
                                                                    <option key={driver._id} value={driver._id}>{driver.name}</option>
                                                                ))
                                                            }
                                                        </select>
                                                        <button onClick={toggleNewDriverContainer}>
                                                            <svg width="9" height="9" viewBox="0 0 9 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <path d="M4.1525 0.336234C3.89794 0.336234 3.69234 0.541839 3.69234 0.796398L3.68908 3.9849L0.497304 3.9849C0.242746 3.9849 0.0371407 4.19051 0.0371407 4.44507C0.0371408 4.69963 0.242746 4.90523 0.497304 4.90523L3.68908 4.90523L3.68908 8.097C3.68908 8.35156 3.89468 8.55717 4.14924 8.55717C4.4038 8.55717 4.6094 8.35156 4.6094 8.097L4.6094 4.90523L7.80117 4.90523C8.05573 4.90523 8.26134 4.69963 8.26134 4.44507C8.26134 4.19051 8.05573 3.9849 7.80117 3.9849L4.6094 3.9849L4.6094 0.793134C4.6094 0.545103 4.40053 0.336234 4.1525 0.336234V0.336234Z" fill="white"/>
                                                            </svg>
                                                        </button>       
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="separator">
                                                <div className="select-wrapper">
                                                    <span>Saída Neópolis</span>
                                                    <div>
                                                        <select name="exitTime" id="exitTime" data-transport-id={transport._id} onChange={handleUpdateTrip} value={transport.exitTime} >
                                                            <option value="">Saída Neópolis</option>
                                                            <option value="04:00">04:00</option>
                                                            <option value="06:00">06:00</option>
                                                            <option value="09:00">09:00</option>
                                                        </select>
                                                    </div>
                                                </div>

                                                <div className="select-wrapper">
                                                    <span>Descanso</span>
                                                    <div>
                                                        <select name="restTime" id="restTime" data-transport-id={transport._id} onChange={handleUpdateTrip} value={transport.restTime} >
                                                            <option value="">Descanso</option>
                                                            <option value="04:00">04:00</option>
                                                            <option value="04:30">04:30</option>
                                                            <option value="05:00">05:00</option>
                                                            <option value="05:30">05:30</option>
                                                            <option value="06:00">06:00</option>
                                                            <option value="06:30">06:30</option>
                                                            <option value="07:00">07:00</option>
                                                            <option value="07:30">07:30</option>
                                                            <option value="08:00">08:00</option>
                                                            <option value="08:30">08:30</option>
                                                            <option value="09:00">09:00</option>
                                                            <option value="09:30">09:30</option>
                                                            <option value="10:00">10:00</option>
                                                            <option value="10:30">10:30</option>
                                                            <option value="11:00">11:00</option>
                                                            <option value="11:30">11:30</option>
                                                            <option value="12:00">12:00</option>
                                                            <option value="12:30">12:30</option>
                                                            <option value="13:00">13:00</option>
                                                            <option value="13:30">13:30</option>
                                                            <option value="14:00">14:00</option>
                                                            <option value="14:30">14:30</option>
                                                            <option value="15:00">15:00</option>
                                                            <option value="15:30">15:30</option>
                                                            <option value="16:00">16:00</option>
                                                            <option value="16:30">16:30</option>
                                                            <option value="17:00">17:00</option>
                                                            <option value="17:30">17:30</option>
                                                            <option value="18:00">18:00</option>
                                                            <option value="18:30">18:30</option>
                                                        </select>
                                                    </div>
                                                </div>
                                                
                                                <div className="select-wrapper">
                                                    <span>Saída destino</span>
                                                    <div>
                                                        <select name="returnTime" id="returnTime" data-transport-id={transport._id} onChange={handleUpdateTrip} value={transport.returnTime}>
                                                            <option value="">Saída Destino</option>
                                                            <option value="04:00">04:00</option>
                                                            <option value="04:30">04:30</option>
                                                            <option value="05:00">05:00</option>
                                                            <option value="05:30">05:30</option>
                                                            <option value="06:00">06:00</option>
                                                            <option value="06:30">06:30</option>
                                                            <option value="07:00">07:00</option>
                                                            <option value="07:30">07:30</option>
                                                            <option value="08:00">08:00</option>
                                                            <option value="08:30">08:30</option>
                                                            <option value="09:00">09:00</option>
                                                            <option value="09:30">09:30</option>
                                                            <option value="10:00">10:00</option>
                                                            <option value="10:30">10:30</option>
                                                            <option value="11:00">11:00</option>
                                                            <option value="11:30">11:30</option>
                                                            <option value="12:00">12:00</option>
                                                            <option value="12:30">12:30</option>
                                                            <option value="13:00">13:00</option>
                                                            <option value="13:30">13:30</option>
                                                            <option value="14:00">14:00</option>
                                                            <option value="14:30">14:30</option>
                                                            <option value="15:00">15:00</option>
                                                            <option value="15:30">15:30</option>
                                                            <option value="16:00">16:00</option>
                                                            <option value="16:30">16:30</option>
                                                            <option value="17:00">17:00</option>
                                                            <option value="17:30">17:30</option>
                                                            <option value="18:00">18:00</option>
                                                            <option value="18:30">18:30</option>
                                                        </select>   
                                                    </div>
                                                </div>

                                                <div className="select-wrapper">
                                                    <span>Chegada Neópolis</span>
                                                    <div>
                                                        <select name="arriveTime" id="arriveTime" data-transport-id={transport._id} onChange={handleUpdateTrip} value={transport.arriveTime}>
                                                            <option value="">Chegada Neópolis</option>
                                                            <option value="04:00">04:00</option>
                                                            <option value="04:30">04:30</option>
                                                            <option value="05:00">05:00</option>
                                                            <option value="05:30">05:30</option>
                                                            <option value="06:00">06:00</option>
                                                            <option value="06:30">06:30</option>
                                                            <option value="07:00">07:00</option>
                                                            <option value="07:30">07:30</option>
                                                            <option value="08:00">08:00</option>
                                                            <option value="08:30">08:30</option>
                                                            <option value="09:00">09:00</option>
                                                            <option value="09:30">09:30</option>
                                                            <option value="10:00">10:00</option>
                                                            <option value="10:30">10:30</option>
                                                            <option value="11:00">11:00</option>
                                                            <option value="11:30">11:30</option>
                                                            <option value="12:00">12:00</option>
                                                            <option value="12:30">12:30</option>
                                                            <option value="13:00">13:00</option>
                                                            <option value="13:30">13:30</option>
                                                            <option value="14:00">14:00</option>
                                                            <option value="14:30">14:30</option>
                                                            <option value="15:00">15:00</option>
                                                            <option value="15:30">15:30</option>
                                                            <option value="16:00">16:00</option>
                                                            <option value="16:30">16:30</option>
                                                            <option value="17:00">17:00</option>
                                                            <option value="17:30">17:30</option>
                                                            <option value="18:00">18:00</option>
                                                            <option value="18:30">18:30</option>
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="transport-table-container">
                                            <table className="exames-table">
                                                <thead>
                                                    <tr>
                                                        <th>Nome</th>
                                                        <th>Endereço</th>
                                                        <th>CPF</th>
                                                        <th>Telefone</th>
                                                        <th>Pegar em</th>
                                                        <th>Destino</th>
                                                        <th>Ações</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        transport.patients.map((patient, patientIndex) => (
                                                            <tr>
                                                                <td><span>{patient.name}</span></td>
                                                                <td><span>{patient.address}</span></td>
                                                                <td><span>{patient.docId}</span></td>
                                                                <td><span>{patient.phone}</span></td>
                                                                <td><span>{patient.pickupLocation}</span></td>
                                                                <td><span>{patient.destination}</span></td>
                                                                <td className="buttons-cell">
                                                                    <button className="edit-button" title="Editar" onClick={toggleEditPatientContainer} data-transport-id={transport._id} data-patient-index={patientIndex}>
                                                                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                            <path d="M0 14.4625V17.5025C0 17.7825 0.22 18.0025 0.5 18.0025H3.54C3.67 18.0025 3.8 17.9525 3.89 17.8525L14.81 6.9425L11.06 3.1925L0.15 14.1025C0.0500001 14.2025 0 14.3225 0 14.4625ZM17.71 4.0425C18.1 3.6525 18.1 3.0225 17.71 2.6325L15.37 0.2925C14.98 -0.0975 14.35 -0.0975 13.96 0.2925L12.13 2.1225L15.88 5.8725L17.71 4.0425Z" fill="#333333"/>
                                                                        </svg>
                                                                    </button>
                                                                    <button className="wpp-button" title={patient.notified ? "Já notificado" : "Notificar"} disabled={patient.notified} data-trip-id={transport._id} data-patient-name={patient.name} data-patient-number={patient.phone} data-doc-id={patient.docId} data-destination={patient.destination} onClick={handleNotifyPatient} data-patient-index={patientIndex}>
                                                                        {
                                                                            patient.notified ? <svg width="16" height="13" viewBox="0 0 16 13" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1.15123 12.935L15.5005 7.20478C16.1665 6.93666 16.1665 6.06334 15.5005 5.79522L1.15123 0.065024C0.608506 -0.157136 0.00822304 0.218238 0.00822304 0.762147L0 4.29372C0 4.67676 0.304253 5.00617 0.715405 5.05213L12.3346 6.5L0.715405 7.94021C0.304253 7.99383 0 8.32324 0 8.70628L0.00822304 12.2379C0.00822304 12.7818 0.608506 13.1571 1.15123 12.935Z" fill="#1BD742"/></svg>
                                                                                :<svg width="18" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                                    <path d="M19.6748 16.5166C19.599 17.363 19.082 18.3049 18.3359 18.7591C16.8337 19.6735 14.9652 19.1459 13.4867 18.4557C10.4701 17.0467 5.74678 12.8507 6.43519 9.23713C6.56771 8.542 7.31783 7.07636 8.11651 6.98275C8.32844 6.95763 9.28848 6.95418 9.46096 7.00591C9.60562 7.04926 9.73663 7.2345 9.80592 7.35963C10.2576 8.17448 10.5459 9.26472 10.9769 10.1111C11.1382 10.8816 10.3062 11.2585 9.91366 11.7876C9.67239 12.1123 9.79429 12.2177 9.95514 12.535C10.2763 13.1665 10.7528 13.7094 11.2581 14.1986C11.9587 14.8775 12.8104 15.452 13.7047 15.8781C13.8489 15.9471 14.4887 16.2422 14.5919 16.2422C14.6516 16.2422 14.8064 16.1717 14.8544 16.1313L16.0588 14.6204C16.2388 14.4573 16.3941 14.5307 16.5889 14.5967C17.2838 14.8307 18.4659 15.3756 19.1371 15.7111C19.5782 15.9313 19.7234 15.9717 19.6748 16.5166Z" fill="#1BD742"/>
                                                                                    <path d="M22.0858 3.65149C16.4227 -1.84455 7.093 -1.00704 2.48657 5.29301C-0.605963 9.52244 -0.778445 15.0569 1.77591 19.5706L0 26.0002L6.70201 24.3212C6.97768 24.3158 7.28977 24.5661 7.55279 24.6789C11.8739 26.5283 16.581 26.2066 20.4505 23.5281C27.1434 18.8952 27.8976 9.29138 22.0858 3.65149ZM7.25385 22.0102C5.87096 22.3058 4.51589 22.7305 3.13604 23.0443L4.29991 19.1804C2.0622 16.0412 1.70054 11.9226 3.34544 8.44451C6.47035 1.83853 15.277 0.191586 20.6073 5.38711C24.0478 8.74109 24.806 13.9041 22.5167 18.102C19.5724 23.5015 12.5892 25.3361 7.25385 22.0102Z" fill="#1BD742"/>
                                                                                    <path d="M19.6748 16.5166C19.599 17.363 19.082 18.3049 18.3359 18.7591C16.8337 19.6735 14.9652 19.1459 13.4867 18.4557C10.4701 17.0467 5.74678 12.8507 6.43519 9.23713C6.56771 8.542 7.31783 7.07636 8.11651 6.98275C8.32844 6.95763 9.28848 6.95418 9.46096 7.00591C9.60562 7.04926 9.73663 7.2345 9.80592 7.35963C10.2576 8.17448 10.5459 9.26472 10.9769 10.1111C11.1382 10.8816 10.3062 11.2585 9.91366 11.7876C9.67239 12.1123 9.79429 12.2177 9.95514 12.535C10.2763 13.1665 10.7528 13.7094 11.2581 14.1986C11.9587 14.8775 12.8104 15.452 13.7047 15.8781C13.8489 15.9471 14.4887 16.2422 14.5919 16.2422C14.6516 16.2422 14.8064 16.1717 14.8544 16.1313L16.0588 14.6204C16.2388 14.4573 16.3941 14.5307 16.5889 14.5967C17.2838 14.8307 18.4659 15.3756 19.1371 15.7111C19.5782 15.9313 19.7234 15.9717 19.6748 16.5166Z" fill="#FEFEFE"/>
                                                                                    <path d="M19.6748 16.5166C19.599 17.363 19.082 18.3049 18.3359 18.7591C16.8337 19.6735 14.9652 19.1459 13.4867 18.4557C10.4701 17.0467 5.74678 12.8507 6.43519 9.23713C6.56771 8.542 7.31783 7.07636 8.11651 6.98275C8.32844 6.95763 9.28848 6.95418 9.46096 7.00591C9.60562 7.04926 9.73663 7.2345 9.80592 7.35963C10.2576 8.17448 10.5459 9.26472 10.9769 10.1111C11.1382 10.8816 10.3062 11.2585 9.91366 11.7876C9.67239 12.1123 9.79429 12.2177 9.95514 12.535C10.2763 13.1665 10.7528 13.7094 11.2581 14.1986C11.9587 14.8775 12.8104 15.452 13.7047 15.8781C13.8489 15.9471 14.4887 16.2422 14.5919 16.2422C14.6516 16.2422 14.8064 16.1717 14.8544 16.1313L16.0588 14.6204C16.2388 14.4573 16.3941 14.5307 16.5889 14.5967C17.2838 14.8307 18.4659 15.3756 19.1371 15.7111C19.5782 15.9313 19.7234 15.9717 19.6748 16.5166Z" fill="#1BD742"/>
                                                                                </svg>
                                                                        }
                                                                        
                                                                    </button>
                                                                    <button className="remove-button" title="Excluir" onClick={handleDeletePatient} data-transport-id={transport._id} data-patient-index={patientIndex}>
                                                                        <svg width="14" height="18" viewBox="0 0 14 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                            <path d="M1 16C1 17.1 1.9 18 3 18H11C12.1 18 13 17.1 13 16V6C13 4.9 12.1 4 11 4H3C1.9 4 1 4.9 1 6V16ZM10.5 1L9.79 0.29C9.61 0.11 9.35 0 9.09 0H4.91C4.65 0 4.39 0.11 4.21 0.29L3.5 1H1C0.45 1 0 1.45 0 2C0 2.55 0.45 3 1 3H13C13.55 3 14 2.55 14 2C14 1.45 13.55 1 13 1H10.5Z" fill="#F04F4F"/>
                                                                        </svg>
                                                                    </button>
                                                                    <button className="print-button" title="Imprimir Comprovante" data-trip-id={transport._id} data-doc-id={patient.docId} data-patient-name={patient.name} data-transport-date={transport.date} data-transport-hour={transport.exitTime} data-destination={patient.destination} data-driver-id={transport.driverId || "vazio"} onClick={handlePrintCoupon} data-patient-index={patientIndex}>
                                                                        {
                                                                            patient.printed 
                                                                                ? <svg width="20" viewBox="0 0 29 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                                    <path d="M21.1182 1.23177L9.38185 12.8838L7.05591 10.4931C6.68281 10.1077 6.2369 9.79909 5.74364 9.58479C5.25039 9.37049 4.71945 9.25474 4.18114 9.24416C3.64283 9.23357 3.10769 9.32836 2.60628 9.52311C2.10487 9.71785 1.647 10.0087 1.25882 10.3792C0.87064 10.7496 0.559748 11.1923 0.343897 11.682C0.128047 12.1717 0.0114642 12.6988 0.000804605 13.2333C-0.0207234 14.3126 0.390504 15.3563 1.14402 16.1346L4.59604 19.7002C5.19447 20.331 5.91368 20.8369 6.71153 21.1882C7.50938 21.5395 8.36983 21.7293 9.24247 21.7463H9.35179C11.0842 21.742 12.745 21.0594 13.9736 19.8468L26.9125 6.99808C27.3041 6.6226 27.6164 6.17346 27.8313 5.67687C28.0462 5.18027 28.1593 4.64616 28.164 4.1057C28.1687 3.56525 28.065 3.02927 27.8588 2.52904C27.6527 2.02881 27.3483 1.57435 26.9633 1.19217C26.5784 0.809999 26.1207 0.507764 25.6168 0.303104C25.113 0.098444 24.5731 -0.00454274 24.0287 0.000153682C23.4844 0.0048501 22.9464 0.117135 22.4462 0.330458C21.946 0.54378 21.4936 0.853867 21.1154 1.24262L21.1182 1.23177Z" fill="white"/>
                                                                                </svg>
                                                                                : <svg width="20" height="18" viewBox="0 0 20 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                                    <path d="M17 5H3C1.34 5 0 6.34 0 8V12C0 13.1 0.9 14 2 14H4V16C4 17.1 4.9 18 6 18H14C15.1 18 16 17.1 16 16V14H18C19.1 14 20 13.1 20 12V8C20 6.34 18.66 5 17 5ZM13 16H7C6.45 16 6 15.55 6 15V11H14V15C14 15.55 13.55 16 13 16ZM17 9C16.45 9 16 8.55 16 8C16 7.45 16.45 7 17 7C17.55 7 18 7.45 18 8C18 8.55 17.55 9 17 9ZM15 0H5C4.45 0 4 0.45 4 1V3C4 3.55 4.45 4 5 4H15C15.55 4 16 3.55 16 3V1C16 0.45 15.55 0 15 0Z" fill="#323232"/>
                                                                                </svg>
                                                                        }
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                        ))
                                                    }

                                                    {
                                                        transport.patients.length < 14 ? (
                                                            <tr>
                                                                <td></td>
                                                                <td></td>
                                                                <td></td>
                                                                <td></td>
                                                                <td></td>
                                                                <td></td>
                                                                <td className="buttons-cell add-patient-row">
                                                                    <button className="add-button" title="Adicionar paciente" onClick={toggleNewPatientContainer} data-transport-id={transport._id}>
                                                                        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                            <path d="M7.58772 0.921888C7.17086 0.921888 6.83417 1.25858 6.83417 1.67544L6.82883 6.89684L1.60208 6.89684C1.18522 6.89684 0.848532 7.23353 0.848532 7.65039C0.848532 8.06725 1.18522 8.40394 1.60208 8.40394L6.82883 8.40394L6.82883 13.6307C6.82883 14.0475 7.16552 14.3842 7.58238 14.3842C7.99924 14.3842 8.33593 14.0475 8.33593 13.6307L8.33593 8.40394L13.5627 8.40394C13.9795 8.40394 14.3162 8.06725 14.3162 7.65039C14.3162 7.23353 13.9795 6.89684 13.5627 6.89684L8.33593 6.89684L8.33593 1.67009C8.33593 1.26392 7.99389 0.921888 7.58772 0.921888Z" fill="white" />
                                                                        </svg>
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                        ) : ""
                                                    }
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </React.Fragment>
                            ))
                            : <div className="listing-container transport new active">
                                <svg width="90" height="100" viewBox="0 0 90 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M70 45H20V55H70V45ZM80 10H75V0H65V10H25V0H15V10H10C4.45 10 0.05 14.5 0.05 20L0 90C0 95.5 4.45 100 10 100H80C85.5 100 90 95.5 90 90V20C90 14.5 85.5 10 80 10ZM80 90H10V35H80V90ZM55 65H20V75H55V65Z" fill="#6B7280"/>
                                </svg>

                                <span className="destaque">Crie um novo Veículo</span>

                                <button onClick={handleCreateTransport}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
                                        <path d="M13.3578 7.07605C13.3578 6.68172 13.0393 6.36323 12.645 6.36323L7.70586 6.35818L7.70586 1.41396C7.70586 1.01963 7.38737 0.701139 6.99304 0.701139C6.59872 0.701139 6.28022 1.01963 6.28022 1.41396L6.28022 6.35818L1.336 6.35818C0.94168 6.35818 0.623188 6.67667 0.623188 7.07099C0.623187 7.46532 0.94168 7.78381 1.336 7.78381L6.28023 7.78381L6.28022 12.728C6.28022 13.1224 6.59872 13.4408 6.99304 13.4408C7.38737 13.4408 7.70586 13.1224 7.70586 12.728L7.70586 7.78381L12.6501 7.78381C13.0343 7.78381 13.3578 7.46026 13.3578 7.07605Z" fill="white"/>
                                    </svg>

                                    <span>Cadastrar transporte</span>
                                </button>

                            </div>
                        }

                        {
                            transports.length < 4 ?
                            <div className="listing-container transport new" id={`transport-${transports.length}`} data-index={transports.length}>
                                <svg width="90" height="100" viewBox="0 0 90 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M70 45H20V55H70V45ZM80 10H75V0H65V10H25V0H15V10H10C4.45 10 0.05 14.5 0.05 20L0 90C0 95.5 4.45 100 10 100H80C85.5 100 90 95.5 90 90V20C90 14.5 85.5 10 80 10ZM80 90H10V35H80V90ZM55 65H20V75H55V65Z" fill="#6B7280"/>
                                </svg>

                                <span className="destaque">Crie um novo Veículo</span>

                                <button onClick={handleCreateTransport}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
                                        <path d="M13.3578 7.07605C13.3578 6.68172 13.0393 6.36323 12.645 6.36323L7.70586 6.35818L7.70586 1.41396C7.70586 1.01963 7.38737 0.701139 6.99304 0.701139C6.59872 0.701139 6.28022 1.01963 6.28022 1.41396L6.28022 6.35818L1.336 6.35818C0.94168 6.35818 0.623188 6.67667 0.623188 7.07099C0.623187 7.46532 0.94168 7.78381 1.336 7.78381L6.28023 7.78381L6.28022 12.728C6.28022 13.1224 6.59872 13.4408 6.99304 13.4408C7.38737 13.4408 7.70586 13.1224 7.70586 12.728L7.70586 7.78381L12.6501 7.78381C13.0343 7.78381 13.3578 7.46026 13.3578 7.07605Z" fill="white"/>
                                    </svg>

                                    <span>Cadastrar transporte</span>
                                </button>

                            </div> : ""

                        }
                    </div>

                    {
                        transports.length ? 
                            <div className="controls-container">
                                <div className="separator">
                                    <div className="swipe-controls-container">
                                        <button onClick={prevTransport}>
                                            <svg width="9" height="15" viewBox="0 0 9 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M7.24608 1.18677C7.31904 1.11381 7.43386 1.11381 7.50682 1.18677C7.53397 1.21393 7.55633 1.25896 7.55663 1.31763C7.5569 1.37415 7.53678 1.41755 7.50682 1.44751L2.38475 6.56958L1.58592 7.36938L2.38377 8.16919L7.50584 13.3049L7.50682 13.3059C7.57975 13.3789 7.57977 13.4937 7.50682 13.5667C7.43387 13.6396 7.31904 13.6396 7.24608 13.5667L1.18651 7.50708C1.11355 7.43412 1.11355 7.3193 1.18651 7.24634L7.24608 1.18677Z" fill="white" stroke="white" stroke-width="2.26314"/>
                                            </svg>
                                        </button>
                                        <button onClick={nextTransport}>
                                            <svg width="9" height="15" viewBox="0 0 9 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M0.692819 14.6143C1.20768 15.1292 2.03939 15.1292 2.55425 14.6143L8.61382 8.55477C9.12869 8.03991 9.12869 7.2082 8.61382 6.69334L2.55425 0.633773C2.03939 0.118909 1.20768 0.118909 0.692817 0.633774C0.177953 1.14864 0.177953 1.98034 0.692818 2.49521L5.81507 7.63066L0.692818 12.7529C0.177954 13.2678 0.191155 14.1127 0.692819 14.6143Z" fill="white"/>
                                            </svg>
                                        </button>
                                    </div>
                                    <button className="remove-transport" onClick={() => handleDeleteTransport(selectedTransportId)}>Excluir Transporte</button>
                                </div>
                                <div className="separator">
                                    <button className="print-transport" onClick={goPrint}>Imprimir</button>
                                </div>
                            </div>
                            : ""
                    }
                </div>
            </div>

            <div className="exame-form-container" id="add-patient">
                <div className="exame-form-wrapper">
                    <div className="exame-form-header">
                        <span>Adicionar Paciente</span>
                        <button onClick={toggleNewPatientContainer}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="11" height="12" viewBox="0 0 11 12" fill="none" >
                                <path d="M9.95979 1.11905C9.65979 0.819045 9.17517 0.819045 8.87517 1.11905L5.11363 4.87289L1.3521 1.11135C1.0521 0.811353 0.56748 0.811353 0.26748 1.11135C-0.0325195 1.41135 -0.0325195 1.89597 0.26748 2.19597L4.02902 5.95751L0.26748 9.71904C-0.0325195 10.019 -0.0325195 10.5037 0.26748 10.8037C0.56748 11.1037 1.0521 11.1037 1.3521 10.8037L5.11363 7.04212L8.87517 10.8037C9.17517 11.1037 9.65979 11.1037 9.95979 10.8037C10.2598 10.5037 10.2598 10.019 9.95979 9.71904L6.19825 5.95751L9.95979 2.19597C10.2521 1.90366 10.2521 1.41135 9.95979 1.11905Z" fill="#333333"/>
                            </svg>  
                        </button>
                    </div>
                    <div className="exame-form-fields">
                        <div className="form-field-wrapper">
                            <span>Nome Completo:</span>
                            <input type="text" name="name" id="newPatientNameEl" placeholder="Ex.: João da Silva" onChange={handleNewPatientChange} value={newPatientData.name}/>
                        </div>
                        <div className="form-field-wrapper">
                            <span>Endereço:</span>
                            <input type="text" name="address" id="newAddressEl" placeholder="Ex.: Rua do Bonfim, 348" onChange={handleNewPatientChange} value={newPatientData.address}/>
                        </div>
                        <div className="form-field-wrapper">
                            <span>CPF:</span>
                            <input type="text" name="docId" id="newDocIdEl" placeholder="000.000.000-00" onChange={handleNewPatientChange} value={newPatientData.docId}/>
                        </div>
                        <div className="form-field-wrapper">
                            <span>Telefone:</span>
                            <input type="text" name="phone" id="newPatientPhoneEl" placeholder="55 79 9999-9999" onChange={handleNewPatientChange} value={newPatientData.phone}/>
                        </div>
                        <div className="form-field-wrapper">
                            <span>Pegar em:</span>
                            <input type="text" name="pickupLocation" id="newPickupLocationEl" onChange={handleNewPatientChange} value={newPatientData.pickupLocation}/>
                        </div>
                        <div className="form-field-wrapper">
                            <span>Destino:</span>
                            <input type="text" name="destination" id="newDestinationEl" onChange={handleNewPatientChange} value={newPatientData.destination}/>
                        </div>
                        <div className="check-wrapper">
                            <input type="checkbox" name="hasAcompanhante" id="hasAcopanhanteEl" onChange={handleHasAcompanhante} />
                            <label htmlFor="hasAcopanhanteEl">Paciente com acompanhante</label>
                        </div>

                        <div className="form-bottom-wrapper unique">
                            <button id="addPatient-button" onClick={handleNewPatientSubmit}>
                                Cadastrar
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="exame-form-container" id="edit-patient">
                <div className="exame-form-wrapper">
                    <div className="exame-form-header">
                        <span>Editar Paciente</span>
                        <button onClick={toggleEditPatientContainer}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="11" height="12" viewBox="0 0 11 12" fill="none" >
                                <path d="M9.95979 1.11905C9.65979 0.819045 9.17517 0.819045 8.87517 1.11905L5.11363 4.87289L1.3521 1.11135C1.0521 0.811353 0.56748 0.811353 0.26748 1.11135C-0.0325195 1.41135 -0.0325195 1.89597 0.26748 2.19597L4.02902 5.95751L0.26748 9.71904C-0.0325195 10.019 -0.0325195 10.5037 0.26748 10.8037C0.56748 11.1037 1.0521 11.1037 1.3521 10.8037L5.11363 7.04212L8.87517 10.8037C9.17517 11.1037 9.65979 11.1037 9.95979 10.8037C10.2598 10.5037 10.2598 10.019 9.95979 9.71904L6.19825 5.95751L9.95979 2.19597C10.2521 1.90366 10.2521 1.41135 9.95979 1.11905Z" fill="#333333"/>
                            </svg>  
                        </button>
                    </div>
                    <div className="exame-form-fields">
                        <div className="form-field-wrapper">
                            <span>Nome Completo:</span>
                            <input type="text" name="name" id="editPatientNameEl" placeholder="Ex.: João da Silva" value={editPatientData.name} onChange={handleEditPatientChange}/>
                        </div>
                        <div className="form-field-wrapper">
                            <span>Endereço:</span>
                            <input type="text" name="address" id="editAddressEl" placeholder="Ex.: Rua do Bonfim, 348" value={editPatientData.address} onChange={handleEditPatientChange}/>
                        </div>
                        <div className="form-field-wrapper">
                            <span>CPF:</span>
                            <input type="text" name="docId" id="editDocIdEl" placeholder="000.000.000-00" value={editPatientData.docId} onChange={handleEditPatientChange}/>
                        </div>
                        <div className="form-field-wrapper">
                            <span>Telefone:</span>
                            <input type="text" name="phone" id="editPhoneEl" placeholder="55 79 9999-9999" value={editPatientData.phone} onChange={handleEditPatientChange}/>
                        </div>
                        <div className="form-field-wrapper">
                            <span>Pegar em:</span>
                            <input type="text" name="pickupLocation" id="editPickupLocationEl" placeholder="Em casa" value={editPatientData.pickupLocation} onChange={handleEditPatientChange}/>
                        </div>
                        <div className="form-field-wrapper">
                            <span>Destino:</span>
                            <input type="text" name="destination" id="editDestinationEl" placeholder="HUSE" value={editPatientData.destination} onChange={handleEditPatientChange}/>
                        </div>

                        <div className="form-bottom-wrapper unique">
                            <button id="editPatient-button" onClick={editPatientDataSubmit}>
                                Salvar alterações
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="exame-form-container" id="remove-paciente">
                <div className="remove-wrapper">
                    <div className="remove-header">
                        <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                            <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" stroke="#ef4444fa"></path>
                            <path d="M12 9v4" stroke="#ef4444fa"></path>
                            <path d="M12 17h.01" stroke="#ef4444fa"></path>
                        </svg>

                        <b>Atenção! Você está prestes a deletar isso</b>
                    </div>
                    <span className="content">
                        Esta ação é <b>permanente</b> e você não poderá recuperar estes dados <br /> depois. Tem certeza que deseja continuar?
                    </span>

                    <div className="buttons-wrapper">
                        <button>Melhor não...</button>
                        <button className="delete" id="delete-button">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                                <path d="M3 6h18" stroke="#FFFFFF"></path>
                                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" stroke="#FFFFFF"></path>
                                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" stroke="#FFFFFF"></path>
                            </svg>
                            Sim, deletar!
                        </button>
                    </div>
                </div>
            </div>

            <div className="exame-form-container transport" id="add-destination">
                <div className="exame-form-wrapper">
                    <div className="exame-type-form-header">
                        <button onClick={toggleNewDestinationContainer}>Voltar</button>
                    </div>  
                    <div className="exame-form-fields">
                        <div className="form-field-wrapper">
                            <span>Novo destino:</span>
                            <div>
                                <input type="text" name="destinationName" id="destinationNameEl" placeholder="Ex.: ARACAJU" onChange={handleSetDestination} value={location} />
                                <button className="new-type-button" onClick={handleAddDestination}>
                                    <svg width="15" height="14" viewBox="0 0 15 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M14.2753 6.94129C14.2753 6.51703 13.9326 6.17435 13.5084 6.17435L8.19418 6.16892L8.19419 0.849297C8.19419 0.425033 7.85151 0.0823582 7.42725 0.0823582C7.00298 0.0823582 6.66031 0.425033 6.66031 0.849297L6.66031 6.16892L1.34069 6.16891C0.916425 6.16892 0.57375 6.51159 0.573751 6.93585C0.573751 7.36012 0.916426 7.70279 1.34069 7.70279L6.66031 7.70279V13.0224C6.66031 13.4467 7.00298 13.7893 7.42725 13.7893C7.85151 13.7893 8.19418 13.4467 8.19418 13.0224V7.70279L13.5138 7.70279C13.9272 7.70279 14.2753 7.35468 14.2753 6.94129Z" fill="white"/>
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <div className="form-field-wrapper">
                            <span>Destinos cadastrados:</span>
                            
                            <div className="exame-types-list">
                                {
                                    destinations.map((destination) => (
                                        <div className="exame-type-element">
                                            <span>{destination.location}</span>
                                            <button data-destination-id={destination._id} onClick={handleRemoveDestination}>
                                                <svg width="9" height="11" viewBox="0 0 9 11" fill="none" xmlns="http://www.w3.org/2000/svg" data-destination-id={destination._id}>
                                                    <path d="M0.604444 9.67111C0.604444 10.336 1.14844 10.88 1.81333 10.88H6.64889C7.31378 10.88 7.85778 10.336 7.85778 9.67111V3.62667C7.85778 2.96178 7.31378 2.41778 6.64889 2.41778H1.81333C1.14844 2.41778 0.604444 2.96178 0.604444 3.62667V9.67111ZM6.34667 0.604444L5.91751 0.175289C5.80871 0.0664889 5.65156 0 5.4944 0H2.96782C2.81067 0 2.65351 0.0664889 2.54471 0.175289L2.11556 0.604444H0.604444C0.272 0.604444 0 0.876444 0 1.20889C0 1.54133 0.272 1.81333 0.604444 1.81333H7.85778C8.19022 1.81333 8.46222 1.54133 8.46222 1.20889C8.46222 0.876444 8.19022 0.604444 7.85778 0.604444H6.34667Z" fill="#F04F4F" data-destination-id={destination._id}/>
                                                </svg>
                                            </button>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="exame-form-container transport" id="add-vehicle">
                <div className="exame-form-wrapper">
                    <div className="exame-type-form-header">
                        <button onClick={toggleNewVehicleContainer}>Voltar</button>
                    </div>  
                    <div className="exame-form-fields">
                        <div className="form-field-wrapper">
                            <span>Descrição:</span>
                            <div>
                                <input type="text" name="description" id="descriptionEl" placeholder="Digite a descrição" onChange={handleNewVehicleChange} value={newVehicleData.description}/>
                            </div>
                        </div>
                        <div className="form-field-wrapper">
                            <span>Placa:</span>
                            <div>
                                <input type="text" name="plate" id="plateEl" placeholder="Digite a placa" onChange={handleNewVehicleChange} value={newVehicleData.plate}/>
                            </div>
                        </div>
                        <div className="form-bottom-wrapper unique">
                            <button onClick={handleNewVehicleSubmit}>
                                Cadastrar
                            </button>
                        </div>

                        <div className="form-field-wrapper">
                            <span>Veículos cadastrados:</span>
                            
                            <div className="exame-types-list">
                                {
                                    vehicles.map((vehicle) => (
                                        <div className="exame-type-element" key={vehicle._id}>
                                            <span>{vehicle.description} - {vehicle.plate}</span>
                                            <button data-vehicle-id={vehicle._id} onClick={handleDeleteVehicle}>
                                                <svg width="9" height="11" viewBox="0 0 9 11" fill="none" xmlns="http://www.w3.org/2000/svg" data-vehicle-id={vehicle._id}>
                                                    <path d="M0.604444 9.67111C0.604444 10.336 1.14844 10.88 1.81333 10.88H6.64889C7.31378 10.88 7.85778 10.336 7.85778 9.67111V3.62667C7.85778 2.96178 7.31378 2.41778 6.64889 2.41778H1.81333C1.14844 2.41778 0.604444 2.96178 0.604444 3.62667V9.67111ZM6.34667 0.604444L5.91751 0.175289C5.80871 0.0664889 5.65156 0 5.4944 0H2.96782C2.81067 0 2.65351 0.0664889 2.54471 0.175289L2.11556 0.604444H0.604444C0.272 0.604444 0 0.876444 0 1.20889C0 1.54133 0.272 1.81333 0.604444 1.81333H7.85778C8.19022 1.81333 8.46222 1.54133 8.46222 1.20889C8.46222 0.876444 8.19022 0.604444 7.85778 0.604444H6.34667Z" fill="#F04F4F" data-vehicle-id={vehicle._id}/>
                                                </svg>
                                            </button>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="exame-form-container transport" id="add-driver">
                <div className="exame-form-wrapper">
                    <div className="exame-type-form-header">
                        <button onClick={toggleNewDriverContainer}>Voltar</button>
                    </div>  
                    <div className="exame-form-fields">
                        <div className="form-field-wrapper">
                            <span>Nome:</span>
                            <div>
                                <input type="text" name="name" id="nameEl" placeholder="Digite o nome do motorista" onChange={handleNewDriverChange} value={newDriverData.name} />
                            </div>
                        </div>
                        <div className="form-field-wrapper">
                            <span>CPF:</span>
                            <div>
                                <input type="text" name="docId" id="docIdEl" placeholder="Digite o CPF" onChange={handleNewDriverChange} value={newDriverData.docId} />
                            </div>
                        </div>
                        <div className="form-bottom-wrapper unique">
                            <button onClick={handleAddDriver}>
                                Cadastrar
                            </button>
                        </div>
                        <div className="form-field-wrapper">
                            <span>Motoristas cadastrados:</span>
                            
                            <div className="exame-types-list">
                                {
                                    drivers.map((driver) => (
                                        <div className="exame-type-element" key={driver._id}>
                                            <span>{driver.name} - {driver.docId}</span>
                                            <button data-driver-id={driver._id} onClick={handleDeleteDriver}>
                                                <svg width="9" height="11" viewBox="0 0 9 11" fill="none" xmlns="http://www.w3.org/2000/svg" data-driver-id={driver._id}>
                                                    <path d="M0.604444 9.67111C0.604444 10.336 1.14844 10.88 1.81333 10.88H6.64889C7.31378 10.88 7.85778 10.336 7.85778 9.67111V3.62667C7.85778 2.96178 7.31378 2.41778 6.64889 2.41778H1.81333C1.14844 2.41778 0.604444 2.96178 0.604444 3.62667V9.67111ZM6.34667 0.604444L5.91751 0.175289C5.80871 0.0664889 5.65156 0 5.4944 0H2.96782C2.81067 0 2.65351 0.0664889 2.54471 0.175289L2.11556 0.604444H0.604444C0.272 0.604444 0 0.876444 0 1.20889C0 1.54133 0.272 1.81333 0.604444 1.81333H7.85778C8.19022 1.81333 8.46222 1.54133 8.46222 1.20889C8.46222 0.876444 8.19022 0.604444 7.85778 0.604444H6.34667Z" fill="#F04F4F" data-driver-id={driver._id}/>
                                                </svg>
                                            </button>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className={`warning-container ${isError ? "error" : "success" } ${modalErrorOpen ? "open" : ""}`}>
                <button onClick={() => setModalErrorOpen(false)}>
                    <svg width="12" height="12" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12.8925 0.3025C12.5025 -0.0874998 11.8725 -0.0874998 11.4825 0.3025L6.5925 5.1825L1.7025 0.2925C1.3125 -0.0975 0.6825 -0.0975 0.2925 0.2925C-0.0975 0.6825 -0.0975 1.3125 0.2925 1.7025L5.1825 6.5925L0.2925 11.4825C-0.0975 11.8725 -0.0975 12.5025 0.2925 12.8925C0.6825 13.2825 1.3125 13.2825 1.7025 12.8925L6.5925 8.0025L11.4825 12.8925C11.8725 13.2825 12.5025 13.2825 12.8925 12.8925C13.2825 12.5025 13.2825 11.8725 12.8925 11.4825L8.0025 6.5925L12.8925 1.7025C13.2725 1.3225 13.2725 0.6825 12.8925 0.3025Z" fill="#000000"/>
                    </svg>
                </button>
                <span id="warning-message">Dados inválidos</span>
            </div>
        </React.Fragment>
    )
}

export default TransportsPanel;