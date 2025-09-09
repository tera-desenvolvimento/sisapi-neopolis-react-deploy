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
import addVehicle from "../controllers/transports/addVehicle.controller";
import addDestination from "../controllers/transports/addDestination.controller";
import removeDestination from "../controllers/transports/removeDestination.controller";
import addDriver from "../controllers/transports/addDriver.controller";
import removeTransport from "../controllers/transports/removeTransport.controller";
import removeVehicle from "../controllers/transports/removeVehicle.controller";
import removeDriver from "../controllers/transports/removeDriver.controller";
import notifyPatient from "../controllers/transports/notifyPatient.controller";

import logoutIcon from "../img/logout.svg";
import logoNeopolis from "../img/logo-01.svg";
import addRowIcon from "../img/add-row.svg";

import "../style/transports.css";

type user = {
    name: string
}

type Patient = {
    name: string;
    docId: string;
    phone: string;
    address: string;
    pickupLocation: string;
    destination: string;
    notified: boolean;
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

function TransportsPanel() {
    const userData = getCookies("userData");
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [transports, setTransports] = useState<Transport[]>([]);
    const [destinations, setDestinations] = useState<Destination[]>([]);
    const [drivers, setDrivers] = useState<Driver[]>([]);
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [newPatientData, setNewPatientData] = useState({} as Patient);
    const [newVehicleData, setNewVehicleData] = useState({} as CVehicle);
    const [newDriverData, setNewDriverData] = useState({} as CDriver);
    const [loaded, setLoaded] = useState(false);
    const [location, setLocation] = useState("");

    if (!loaded) {
        (function loadData() {
            listTransports(selectedDate.toLocaleDateString())
                .then(data => {
                    setTransports(data.trips);
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

    function handleDateChange(date: Date) {
        setSelectedDate(date);
        
        listTransports(selectedDate.toLocaleDateString())
            .then(data => {
                setTransports(data.trips);
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
        if (event.target.id === "docIdEl"){
            var cpf = event.target.value;
            cpf = cpf.replace(/[^\d]/g, "");
            cpf = cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");

            setNewPatientData({
                ...newPatientData,
                docId: cpf
            });
        } else {
            setNewPatientData({
                ...newPatientData,
                [event.target.name]: event.target.value
            });
        }
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
                    });
            });
        }
    }

    async function handleCreateTransport() {
        try {
            const newTransport = await createTransport(selectedDate.toLocaleDateString());

            const updatedTransports = [...transports, newTransport.trip];
            setTransports(updatedTransports);

            setTimeout(() => {
                const realItems = Array.from(
                document.querySelectorAll<HTMLDivElement>(".transport-element:not(.new-transport)")
            );

            if (realItems.length === 0) return;

            realItems.forEach(el => el.classList.remove("active"));

            const id = newTransport?.trip?.id ?? newTransport?.trip?._id;
            const byId = id
                ? document.querySelector<HTMLDivElement>(
                    `.transport-element:not(.new-transport)[data-id="${id}"]`
                )
                : null;

            const target = byId ?? realItems[realItems.length - 1];

            target.classList.add("active");
            }, 50);
            
            document.querySelector(".transport-element.new-transport")?.classList.remove("active");

        } catch (error) {
            console.error("Error creating transport:", error);
        }
    }

    function toggleNewVehicleContainer() {
        const container = document.getElementById("newVehicleContainer");
        if (container) {
            container.classList.toggle("hidden");
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

    async function handleNewVehicleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        try {
            const response = await addVehicle(newVehicleData);

            setVehicles(prevVehicles => [...prevVehicles, response]);

            toggleNewVehicleContainer();

        } catch (error) {
            console.error("Error adding vehicle:", error);
        }
    }

    function toggleNewDestinationContainer() {
        const container = document.getElementById("newDestinationContainer");
        if (container) {
            container.classList.toggle("hidden");
        }
    }

    function handleSetDestination(event: React.ChangeEvent<HTMLInputElement>) {
        setLocation(event.target.value)
    }

    async function handleAddDestination(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
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

    function toggleNewDriverContainer() {
        const container = document.getElementById("newDriverContainer");
        if (container) {
            container.classList.toggle("hidden");
        }
    }

    function handleNewDriverChange(event: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target;
        setNewDriverData(prevState => ({
            ...prevState,
            [name]: value
        }));
    }

    async function handleAddDriver(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        try {
            const newDriver = await addDriver(newDriverData);
            setDrivers([...drivers, newDriver.driver]);

            toggleNewDriverContainer();
        } catch (error) {
            console.error("Error adding driver:", error);
        }
    }

    function handleDeleteTransport(transportId: string) {
        removeTransport(transportId)
            .then(response => {
                if (response.message === "trip has patients") {
                    alert("Não é possível remover transportes que contenham pacientes. Revise os dados e tente novamente!");
                } else {
                    const currentElement = document.querySelector(
                        `.transport-element[data-id="${transportId}"]`
                    ) as HTMLDivElement | null;
                    const currentIndex = currentElement ? Number(currentElement.dataset.index) : -1;

                    listTransports(selectedDate.toLocaleDateString())
                        .then(data => {
                            setTransports(data.trips);

                            setTimeout(() => {
                                const elements = document.querySelectorAll(".transport-element");

                                let targetIndex = currentIndex > 0 ? currentIndex - 1 : 0;

                                const target = elements[targetIndex] as HTMLDivElement | undefined;
                                if (target) {
                                    elements.forEach(el => el.classList.remove("active"));
                                    target.classList.add("active");
                                }
                            }, 50);
                        })
                        .catch(err => console.error("Erro ao listar transportes:", err));
                }
            })
            .catch(error => {
                console.error("Error deleting transport:", error);
            });
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

    async function handleDeleteDriver(event: React.MouseEvent<HTMLButtonElement>) {
        const driverId = event.currentTarget.dataset.driverId || "";

        try {
            await removeDriver(driverId);
            setDrivers(drivers.filter(driver => driver._id !== driverId));
        } catch (error) {
            console.error("Error removing driver:", error);
        }
    }

    function goPrint(id: string) {
        window.open(`/transportes/imprimir/${id}`, '_blank')?.focus();
    }

    async function handleNotifyPatient(event: React.MouseEvent<HTMLButtonElement>) {
        const tripId = event.currentTarget.dataset.tripId || "";
        const patientName = event.currentTarget.dataset.patientName || "";
        const patientNumber = event.currentTarget.dataset.patientNumber || "";
        const docId = event.currentTarget.dataset.docId;
        const destination = event.currentTarget.dataset.destination || "";

        try {
            await notifyPatient(tripId, patientName, patientNumber, destination);
            const transport = transports.find(transport => transport._id === tripId);
            if (transport) {
                const patient = transport.patients.find(patient => patient.docId === docId);
                if (patient) {
                    patient.notified = true;
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

        } catch (error) {
            console.error("Error notifying patient:", error);
        }
    }

    return (
        <React.Fragment>
            <div className="main-container">
                <div className="aside-container">
                    <div className="menu-container">
                        <div className="logo-wrapper">
                            <svg height="25" viewBox="0 0 253 35" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M46.9171 28V5.10317H38.9205V0.328203H60.7242V5.10317H52.7084V28H46.9171ZM60.8777 28V7.44271H66.4772V11.0287H66.5923C66.8991 9.76308 67.4552 8.77868 68.2606 8.07554C69.0661 7.3724 70.0696 7.02083 71.2714 7.02083C71.5782 7.02083 71.8722 7.04 72.1535 7.07836C72.4347 7.11671 72.6776 7.16785 72.8822 7.23177V12.1601C72.6521 12.0707 72.358 12.0003 72.0001 11.9492C71.6421 11.8853 71.2586 11.8533 70.8495 11.8533C69.929 11.8533 69.1428 12.0323 68.4908 12.3903C67.8388 12.7482 67.3402 13.2724 66.995 13.9627C66.6498 14.6531 66.4772 15.4969 66.4772 16.4941V28H60.8777ZM80.8021 28.326C79.4342 28.326 78.2325 28.0639 77.1969 27.5398C76.1614 27.0028 75.3496 26.2677 74.7615 25.3345C74.1862 24.3884 73.8985 23.3145 73.8985 22.1128V22.0744C73.8985 20.8216 74.2118 19.7541 74.8382 18.872C75.4646 17.977 76.3723 17.2739 77.5613 16.7625C78.7502 16.2512 80.1949 15.9379 81.8952 15.8229L89.911 15.3243V18.8144L82.739 19.2747C81.6651 19.3386 80.8469 19.5943 80.2843 20.0417C79.7218 20.4764 79.4406 21.0581 79.4406 21.7868V21.8251C79.4406 22.5794 79.7282 23.1739 80.3035 23.6086C80.8788 24.0304 81.6523 24.2414 82.6239 24.2414C83.4549 24.2414 84.1964 24.0816 84.8484 23.762C85.5132 23.4296 86.0309 22.9821 86.4017 22.4196C86.7852 21.8443 86.977 21.1987 86.977 20.4828V14.2504C86.977 13.3427 86.6893 12.6268 86.114 12.1026C85.5387 11.5657 84.7014 11.2972 83.6019 11.2972C82.5536 11.2972 81.7226 11.5145 81.1089 11.9492C80.4953 12.3839 80.1182 12.9336 79.9775 13.5984L79.9392 13.771H74.819L74.8382 13.5409C74.9405 12.2752 75.356 11.1502 76.0847 10.1658C76.8262 9.18139 77.8489 8.41433 79.1529 7.8646C80.4697 7.30208 82.0294 7.02083 83.832 7.02083C85.609 7.02083 87.1496 7.30848 88.4536 7.88377C89.7576 8.44629 90.7675 9.24531 91.4835 10.2808C92.2122 11.3164 92.5765 12.5245 92.5765 13.9052V28H86.977V24.9317H86.8619C86.4784 25.6349 85.9798 26.2421 85.3661 26.7535C84.7653 27.2521 84.0813 27.642 83.3142 27.9233C82.5472 28.1918 81.7098 28.326 80.8021 28.326ZM96.2009 28V7.44271H101.8V10.8178H101.916C102.452 9.64163 103.245 8.71476 104.293 8.03719C105.342 7.35961 106.639 7.02083 108.186 7.02083C110.449 7.02083 112.194 7.70479 113.421 9.07272C114.662 10.4279 115.282 12.3136 115.282 14.7298V28H109.682V15.8804C109.682 14.538 109.362 13.5025 108.723 12.7738C108.097 12.0323 107.157 11.6616 105.904 11.6616C105.073 11.6616 104.351 11.8533 103.737 12.2369C103.124 12.6076 102.644 13.1318 102.299 13.8093C101.967 14.4869 101.8 15.2795 101.8 16.1872V28H96.2009ZM127.286 28.4219C125.394 28.4219 123.783 28.147 122.454 27.5973C121.124 27.0476 120.082 26.2869 119.328 25.3153C118.586 24.3309 118.139 23.1931 117.985 21.9018L117.966 21.7293H123.432L123.47 21.9018C123.649 22.7073 124.052 23.3337 124.678 23.7812C125.305 24.2286 126.174 24.4523 127.286 24.4523C128.002 24.4523 128.609 24.3692 129.108 24.203C129.606 24.0241 129.99 23.7748 130.258 23.4552C130.54 23.1355 130.68 22.752 130.68 22.3046V22.2854C130.68 21.7357 130.482 21.2946 130.086 20.9622C129.69 20.6298 128.986 20.3485 127.976 20.1184L124.486 19.3897C123.157 19.1085 122.045 18.7058 121.15 18.1816C120.268 17.6446 119.603 16.9863 119.155 16.2064C118.708 15.4138 118.484 14.5061 118.484 13.4833V13.4642C118.484 12.1474 118.836 11.0096 119.539 10.0507C120.242 9.0919 121.239 8.3504 122.53 7.82624C123.834 7.2893 125.356 7.02083 127.094 7.02083C128.91 7.02083 130.45 7.31487 131.716 7.90295C132.994 8.47825 133.972 9.25809 134.65 10.2425C135.34 11.2269 135.705 12.32 135.743 13.5217V13.7135H130.584L130.565 13.56C130.476 12.8185 130.131 12.2049 129.53 11.7191C128.942 11.2205 128.13 10.9712 127.094 10.9712C126.455 10.9712 125.899 11.0607 125.426 11.2397C124.953 11.4187 124.589 11.6743 124.333 12.0067C124.077 12.3263 123.949 12.7099 123.949 13.1573V13.1765C123.949 13.5217 124.033 13.8349 124.199 14.1162C124.378 14.3846 124.672 14.6211 125.081 14.8257C125.49 15.0302 126.04 15.2092 126.73 15.3626L130.22 16.1105C132.381 16.558 133.928 17.2292 134.861 18.1241C135.807 19.019 136.28 20.2207 136.28 21.7293V21.7484C136.28 23.0908 135.896 24.2606 135.129 25.2577C134.362 26.2549 133.301 27.0348 131.946 27.5973C130.604 28.147 129.05 28.4219 127.286 28.4219ZM139.041 34.7118V7.44271H144.641V11.0287H144.775C145.146 10.1977 145.632 9.48182 146.233 8.88096C146.846 8.28009 147.556 7.81985 148.361 7.50024C149.179 7.18063 150.074 7.02083 151.046 7.02083C152.785 7.02083 154.28 7.4491 155.533 8.30566C156.786 9.14943 157.751 10.3703 158.429 11.9684C159.106 13.5664 159.445 15.4777 159.445 17.7022V17.7214C159.445 19.9458 159.106 21.8571 158.429 23.4552C157.764 25.0532 156.812 26.2805 155.572 27.1371C154.331 27.9936 152.849 28.4219 151.123 28.4219C150.151 28.4219 149.25 28.2621 148.419 27.9425C147.588 27.6229 146.865 27.1754 146.252 26.6001C145.638 26.012 145.14 25.3089 144.756 24.4907H144.641V34.7118H139.041ZM149.205 23.7812C150.138 23.7812 150.944 23.5383 151.621 23.0524C152.299 22.5539 152.823 21.8507 153.194 20.943C153.564 20.0353 153.75 18.9614 153.75 17.7214V17.7022C153.75 16.4493 153.564 15.369 153.194 14.4613C152.823 13.5536 152.292 12.8633 151.602 12.3903C150.924 11.9045 150.125 11.6616 149.205 11.6616C148.297 11.6616 147.498 11.9109 146.808 12.4094C146.118 12.8953 145.581 13.592 145.197 14.4997C144.814 15.3946 144.622 16.4685 144.622 17.7214V17.7405C144.622 18.9678 144.814 20.0353 145.197 20.943C145.593 21.8507 146.13 22.5539 146.808 23.0524C147.498 23.5383 148.297 23.7812 149.205 23.7812ZM171.795 28.4219C169.711 28.4219 167.909 27.9936 166.387 27.1371C164.866 26.2805 163.69 25.0532 162.859 23.4552C162.028 21.8571 161.612 19.9458 161.612 17.7214V17.683C161.612 15.4713 162.034 13.5728 162.878 11.9876C163.722 10.3895 164.904 9.16221 166.426 8.30566C167.947 7.4491 169.73 7.02083 171.776 7.02083C173.834 7.02083 175.624 7.4491 177.145 8.30566C178.679 9.14943 179.868 10.3703 180.712 11.9684C181.556 13.5536 181.978 15.4585 181.978 17.683V17.7214C181.978 19.9586 181.556 21.8763 180.712 23.4743C179.881 25.0724 178.705 26.2997 177.184 27.1562C175.662 28 173.866 28.4219 171.795 28.4219ZM171.814 24.0304C172.722 24.0304 173.508 23.7875 174.173 23.3017C174.85 22.8031 175.368 22.0872 175.726 21.154C176.097 20.2079 176.282 19.0637 176.282 17.7214V17.683C176.282 16.3534 176.097 15.222 175.726 14.2887C175.355 13.3555 174.831 12.646 174.154 12.1601C173.476 11.6616 172.683 11.4123 171.776 11.4123C170.881 11.4123 170.095 11.6616 169.417 12.1601C168.752 12.646 168.235 13.3555 167.864 14.2887C167.493 15.222 167.308 16.3534 167.308 17.683V17.7214C167.308 19.0637 167.487 20.2079 167.845 21.154C168.215 22.0872 168.739 22.8031 169.417 23.3017C170.095 23.7875 170.894 24.0304 171.814 24.0304ZM184.873 28V7.44271H190.473V11.0287H190.588C190.895 9.76308 191.451 8.77868 192.256 8.07554C193.062 7.3724 194.065 7.02083 195.267 7.02083C195.574 7.02083 195.868 7.04 196.149 7.07836C196.43 7.11671 196.673 7.16785 196.878 7.23177V12.1601C196.648 12.0707 196.354 12.0003 195.996 11.9492C195.638 11.8853 195.254 11.8533 194.845 11.8533C193.925 11.8533 193.138 12.0323 192.486 12.3903C191.834 12.7482 191.336 13.2724 190.991 13.9627C190.646 14.6531 190.473 15.4969 190.473 16.4941V28H184.873ZM208.115 28.4219C205.84 28.4219 204.152 27.9425 203.053 26.9836C201.953 26.0248 201.404 24.4459 201.404 22.247V11.6616H198.546V7.44271H201.404V2.41845H207.061V7.44271H210.819V11.6616H207.061V21.6334C207.061 22.5922 207.272 23.2634 207.694 23.6469C208.128 24.0177 208.767 24.203 209.611 24.203C209.867 24.203 210.091 24.1966 210.282 24.1839C210.474 24.1583 210.653 24.1327 210.819 24.1072V28.2109C210.512 28.2621 210.129 28.3068 209.669 28.3452C209.221 28.3963 208.703 28.4219 208.115 28.4219ZM222.996 28.4219C220.9 28.4219 219.097 27.9936 217.589 27.1371C216.08 26.2677 214.917 25.034 214.098 23.436C213.293 21.8379 212.89 19.9458 212.89 17.7597V17.7405C212.89 15.5544 213.293 13.6623 214.098 12.0643C214.917 10.4534 216.061 9.21335 217.531 8.34401C219.014 7.46189 220.759 7.02083 222.766 7.02083C224.773 7.02083 226.506 7.4491 227.963 8.30566C229.433 9.14943 230.565 10.3448 231.357 11.8917C232.163 13.4386 232.566 15.2476 232.566 17.3186V19.0445H215.633V15.5161H229.919L227.254 18.8144V16.6666C227.254 15.4649 227.068 14.4613 226.697 13.6559C226.327 12.8377 225.809 12.2241 225.144 11.815C224.492 11.4059 223.732 11.2013 222.862 11.2013C221.993 11.2013 221.219 11.4123 220.542 11.8341C219.877 12.256 219.353 12.8761 218.969 13.6943C218.599 14.4997 218.413 15.4905 218.413 16.6666V18.8336C218.413 19.9714 218.599 20.943 218.969 21.7484C219.353 22.5539 219.896 23.1739 220.599 23.6086C221.302 24.0304 222.14 24.2414 223.111 24.2414C223.879 24.2414 224.543 24.1199 225.106 23.877C225.668 23.6341 226.129 23.3273 226.487 22.9566C226.845 22.5858 227.087 22.2087 227.215 21.8251L227.254 21.7101H232.393L232.335 21.921C232.182 22.6753 231.882 23.436 231.434 24.203C230.987 24.9701 230.379 25.6732 229.612 26.3125C228.858 26.9517 227.931 27.4631 226.832 27.8466C225.745 28.2301 224.467 28.4219 222.996 28.4219ZM243.918 28.4219C242.026 28.4219 240.415 28.147 239.086 27.5973C237.756 27.0476 236.714 26.2869 235.96 25.3153C235.218 24.3309 234.771 23.1931 234.617 21.9018L234.598 21.7293H240.064L240.102 21.9018C240.281 22.7073 240.684 23.3337 241.31 23.7812C241.936 24.2286 242.806 24.4523 243.918 24.4523C244.634 24.4523 245.241 24.3692 245.74 24.203C246.238 24.0241 246.622 23.7748 246.89 23.4552C247.172 23.1355 247.312 22.752 247.312 22.3046V22.2854C247.312 21.7357 247.114 21.2946 246.718 20.9622C246.322 20.6298 245.618 20.3485 244.608 20.1184L241.118 19.3897C239.789 19.1085 238.676 18.7058 237.782 18.1816C236.899 17.6446 236.235 16.9863 235.787 16.2064C235.34 15.4138 235.116 14.5061 235.116 13.4833V13.4642C235.116 12.1474 235.468 11.0096 236.171 10.0507C236.874 9.0919 237.871 8.3504 239.162 7.82624C240.466 7.2893 241.988 7.02083 243.726 7.02083C245.542 7.02083 247.082 7.31487 248.348 7.90295C249.626 8.47825 250.604 9.25809 251.282 10.2425C251.972 11.2269 252.337 12.32 252.375 13.5217V13.7135H247.216L247.197 13.56C247.108 12.8185 246.763 12.2049 246.162 11.7191C245.574 11.2205 244.762 10.9712 243.726 10.9712C243.087 10.9712 242.531 11.0607 242.058 11.2397C241.585 11.4187 241.221 11.6743 240.965 12.0067C240.709 12.3263 240.581 12.7099 240.581 13.1573V13.1765C240.581 13.5217 240.664 13.8349 240.831 14.1162C241.01 14.3846 241.304 14.6211 241.713 14.8257C242.122 15.0302 242.672 15.2092 243.362 15.3626L246.852 16.1105C249.013 16.558 250.56 17.2292 251.493 18.1241C252.439 19.019 252.912 20.2207 252.912 21.7293V21.7484C252.912 23.0908 252.528 24.2606 251.761 25.2577C250.994 26.2549 249.933 27.0348 248.578 27.5973C247.236 28.147 245.682 28.4219 243.918 28.4219Z" fill="#333333"/>
                                <path d="M29.7199 11.9388L27.3704 6.825C26.7098 5.38944 25.6337 4.1698 24.2721 3.31353C22.9105 2.45726 21.3217 2.00103 19.6979 2C14.5402 2 14.3744 2 7.10416 2C5.22065 2.00199 3.41487 2.72695 2.08303 4.01583C0.751182 5.30472 0.00205138 7.05225 0 8.875V18.875C0.00436864 19.924 0.398069 20.9366 1.10935 21.7281C1.82063 22.5197 2.80214 23.0377 3.875 23.1875V23.25C3.875 24.2446 4.28326 25.1984 5.00996 25.9017C5.73666 26.6049 6.72228 27 7.75 27C8.77771 27 9.76333 26.6049 10.49 25.9017C11.2167 25.1984 11.625 24.2446 11.625 23.25H18.0833C18.0833 24.2446 18.4916 25.1984 19.2183 25.9017C19.945 26.6049 20.9306 27 21.9583 27C22.986 27 23.9717 26.6049 24.6984 25.9017C25.4251 25.1984 25.8333 24.2446 25.8333 23.25H26.4792C27.6782 23.25 28.828 22.7891 29.6759 21.9686C30.5237 21.1481 31 20.0353 31 18.875V17.7775C31.0031 15.7657 30.5669 13.776 29.7199 11.9388ZM27.125 18.875C27.125 19.0408 27.0569 19.1997 26.9358 19.3169C26.8147 19.4342 26.6504 19.5 26.4792 19.5H4.52083C4.34955 19.5 4.18528 19.4342 4.06416 19.3169C3.94304 19.1997 3.875 19.0408 3.875 18.875V8.875C3.875 8.0462 4.21521 7.25134 4.8208 6.66529C5.42638 6.07924 6.24774 5.75 7.10416 5.75H19.6979C20.0241 5.75357 20.349 5.79172 20.6667 5.86375V12C20.6667 12.663 20.9388 13.2989 21.4233 13.7678C21.9078 14.2366 22.5648 14.5 23.25 14.5H26.5902C26.946 15.5584 27.1265 16.6645 27.125 17.7775V18.875Z" fill="#333333"/>
                            </svg>
                        </div>

                        <div className="menu-wrapper">
                            <a href="#" className="selected">
                                <svg width="16" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M17.7292 1.91667H17.25V1.4375C17.25 1.05625 17.0985 0.690617 16.829 0.421034C16.5594 0.15145 16.1937 0 15.8125 0C15.4313 0 15.0656 0.15145 14.796 0.421034C14.5264 0.690617 14.375 1.05625 14.375 1.4375V1.91667H8.625V1.4375C8.625 1.05625 8.47355 0.690617 8.20397 0.421034C7.93438 0.15145 7.56875 0 7.1875 0C6.80625 0 6.44062 0.15145 6.17103 0.421034C5.90145 0.690617 5.75 1.05625 5.75 1.4375V1.91667H5.27083C3.87292 1.91667 2.53226 2.47199 1.54379 3.46046C0.555318 4.44893 0 5.78959 0 7.1875V17.7292C0 19.1271 0.555318 20.4677 1.54379 21.4562C2.53226 22.4447 3.87292 23 5.27083 23H17.7292C19.1271 23 20.4677 22.4447 21.4562 21.4562C22.4447 20.4677 23 19.1271 23 17.7292V7.1875C23 5.78959 22.4447 4.44893 21.4562 3.46046C20.4677 2.47199 19.1271 1.91667 17.7292 1.91667ZM17.7292 20.125H5.27083C4.63542 20.125 4.02603 19.8726 3.57672 19.4233C3.12742 18.974 2.875 18.3646 2.875 17.7292V9.58333H20.125V17.7292C20.125 18.3646 19.8726 18.974 19.4233 19.4233C18.974 19.8726 18.3646 20.125 17.7292 20.125Z" fill="#161179"/>
                                </svg>

                                <span>Agendar Vagas</span>
                            </a>

                            <a href="/transportes/fixos">
                                <svg width="16" height="16" viewBox="0 0 16 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M7.4524 13.4341C3.19085 13.8033 -0.0558474 17.2543 0.000728177 21.3546V21.5625C0.000728177 22.3564 0.672276 23 1.50066 23C2.32905 23 3.00059 22.3564 3.00059 21.5625V21.2971C2.9555 18.7795 4.89417 16.6326 7.50039 16.3139C10.2515 16.0525 12.7029 17.9778 12.9757 20.6144C12.9918 20.7703 13 20.9268 13.0001 21.0834V21.5625C13.0001 22.3564 13.6717 23 14.5001 23C15.3285 23 16 22.3564 16 21.5625V21.0834C15.9951 16.8445 12.4056 13.412 7.98253 13.4167C7.80568 13.4169 7.62887 13.4227 7.4524 13.4341Z" fill="#333333"/>
                                    <path d="M8.00033 11.4997C11.3139 11.4997 14.0001 8.9254 14.0001 5.74986C14.0001 2.57432 11.3139 0 8.00033 0C4.68679 0 2.00059 2.57432 2.00059 5.74986C2.00388 8.9241 4.68815 11.4965 8.00033 11.4997ZM8.00033 2.87493C9.6571 2.87493 11.0002 4.16209 11.0002 5.74986C11.0002 7.33763 9.6571 8.62479 8.00033 8.62479C6.34356 8.62479 5.00046 7.33763 5.00046 5.74986C5.00046 4.16209 6.34356 2.87493 8.00033 2.87493Z" fill="#333333"/>
                                </svg>

                                <span>Pacientes Fixos</span>
                            </a>

                            <a href={window.location.origin + "/boletim-transportes.pdf"} target="_blank" rel="noopener noreferrer">
                                <svg width="16" viewBox="0 0 23 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M22.0503 7.1559L20.3071 3.474C19.817 2.4404 19.0186 1.56226 18.0083 0.945743C16.9981 0.32923 15.8194 0.000743961 14.6146 0C10.7879 0 10.6649 0 5.27083 0C3.87339 0.00142935 2.53361 0.523404 1.54547 1.4514C0.557329 2.3794 0.001522 3.63762 0 4.95V12.15C0.00324125 12.9053 0.295341 13.6343 0.823066 14.2043C1.35079 14.7742 2.07901 15.1471 2.875 15.255V15.3C2.875 16.0161 3.1779 16.7028 3.71707 17.2092C4.25623 17.7155 4.9875 18 5.75 18C6.51249 18 7.24376 17.7155 7.78293 17.2092C8.32209 16.7028 8.625 16.0161 8.625 15.3H13.4167C13.4167 16.0161 13.7196 16.7028 14.2587 17.2092C14.7979 17.7155 15.5292 18 16.2917 18C17.0542 18 17.7854 17.7155 18.3246 17.2092C18.8638 16.7028 19.1667 16.0161 19.1667 15.3H19.6458C20.5354 15.3 21.3885 14.9681 22.0176 14.3774C22.6466 13.7866 23 12.9854 23 12.15V11.3598C23.0023 9.91132 22.6786 8.47873 22.0503 7.1559ZM20.125 12.15C20.125 12.2693 20.0745 12.3838 19.9846 12.4682C19.8948 12.5526 19.7729 12.6 19.6458 12.6H3.35417C3.22708 12.6 3.1052 12.5526 3.01534 12.4682C2.92548 12.3838 2.875 12.2693 2.875 12.15V4.95C2.875 4.35326 3.12742 3.78097 3.57672 3.35901C4.02603 2.93705 4.63542 2.7 5.27083 2.7H14.6146C14.8566 2.70257 15.0976 2.73004 15.3333 2.7819V7.2C15.3333 7.67739 15.5353 8.13523 15.8947 8.47279C16.2541 8.81036 16.7417 9 17.25 9H19.7282C19.9922 9.76202 20.1261 10.5585 20.125 11.3598V12.15Z" fill="#333333"/>
                                </svg>

                                <span>Imprimir relatório de inspeção</span>
                            </a>
                        </div>
                    </div>

                    <DateSelector value={selectedDate} onChange={handleDateChange} />
                </div>

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
                                        <div className={`transport-element ${index === 0 ? 'active' : ''}`} id={`transport-${index}`} data-index={index} data-transport-id={transport._id} key={transport._id}>
                                            <div className="transport-header">
                                                <div className="general-data-wrapper">
                                                    <div className="line">
                                                        <div className="separator">
                                                            <span>Destino:</span>
                                                            <select name="destination" id="destination" data-transport-id={transport._id} onChange={handleUpdateTrip} value={transport.destination}>
                                                                <option value="">Selecione o destino</option>
                                                                {
                                                                    destinations.map(dest => (
                                                                        <option value={dest.location} key={dest._id}>{dest.location}</option>
                                                                    ))
                                                                }
                                                            </select>
                                                            <button id="add-destination" onClick={toggleNewDestinationContainer}>
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
                                                                        <option key={vehicle._id} value={vehicle._id}> {vehicle.description} ({vehicle.plate}) </option>
                                                                    ))
                                                                }
                                                            </select>
                                                            <button id="add-vehicle" onClick={toggleNewVehicleContainer}>
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
                                                                        <option key={driver._id} value={driver._id}>{driver.name}</option>
                                                                    ))
                                                                }
                                                            </select>
                                                            <button id="add-driver" onClick={toggleNewDriverContainer}>
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
                                                                        <button onClick={handleDeletePatient} data-transport-id={transport._id} data-patient-index={patientIndex}>
                                                                            <svg width="20" viewBox="0 0 26 27" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                                <path d="M18.9953 13.5751L24.4983 8.07494C25.2965 7.27674 25.7449 6.19415 25.7449 5.06532C25.7449 3.9365 25.2965 2.85391 24.4983 2.05571C23.7001 1.25751 22.6175 0.809082 21.4886 0.809082C20.3598 0.809082 19.2772 1.25751 18.479 2.05571L12.9789 7.55868L7.47875 2.05571C6.68055 1.25751 5.59796 0.809082 4.46913 0.809082C3.34031 0.809082 2.25772 1.25751 1.45952 2.05571C0.661315 2.85391 0.212891 3.9365 0.212891 5.06532C0.212891 6.19415 0.661315 7.27674 1.45952 8.07494L6.96249 13.5751L1.45952 19.0752C0.661315 19.8734 0.212891 20.956 0.212891 22.0848C0.212891 23.2137 0.661315 24.2963 1.45952 25.0945C2.25772 25.8927 3.34031 26.3411 4.46913 26.3411C5.59796 26.3411 6.68055 25.8927 7.47875 25.0945L12.9789 19.5915L18.479 25.0945C19.2772 25.8927 20.3598 26.3411 21.4886 26.3411C22.6175 26.3411 23.7001 25.8927 24.4983 25.0945C25.2965 24.2963 25.7449 23.2137 25.7449 22.0848C25.7449 20.956 25.2965 19.8734 24.4983 19.0752L18.9953 13.5751Z" fill="#FFFFFF"/>
                                                                            </svg>
                                                                        </button>
                                                                        <button className={ patient.notified ? "sent" : ""}  data-trip-id={transport._id} data-patient-name={patient.name} data-patient-number={patient.phone} data-doc-id={patient.docId} disabled={patient.notified} data-destination={patient.destination} onClick={handleNotifyPatient}>
                                                                            {
                                                                                patient.notified 
                                                                                    ? <svg width="20" viewBox="0 0 29 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                                        <path d="M21.1182 1.23177L9.38185 12.8838L7.05591 10.4931C6.68281 10.1077 6.2369 9.79909 5.74364 9.58479C5.25039 9.37049 4.71945 9.25474 4.18114 9.24416C3.64283 9.23357 3.10769 9.32836 2.60628 9.52311C2.10487 9.71785 1.647 10.0087 1.25882 10.3792C0.87064 10.7496 0.559748 11.1923 0.343897 11.682C0.128047 12.1717 0.0114642 12.6988 0.000804605 13.2333C-0.0207234 14.3126 0.390504 15.3563 1.14402 16.1346L4.59604 19.7002C5.19447 20.331 5.91368 20.8369 6.71153 21.1882C7.50938 21.5395 8.36983 21.7293 9.24247 21.7463H9.35179C11.0842 21.742 12.745 21.0594 13.9736 19.8468L26.9125 6.99808C27.3041 6.6226 27.6164 6.17346 27.8313 5.67687C28.0462 5.18027 28.1593 4.64616 28.164 4.1057C28.1687 3.56525 28.065 3.02927 27.8588 2.52904C27.6527 2.02881 27.3483 1.57435 26.9633 1.19217C26.5784 0.809999 26.1207 0.507764 25.6168 0.303104C25.113 0.098444 24.5731 -0.00454274 24.0287 0.000153682C23.4844 0.0048501 22.9464 0.117135 22.4462 0.330458C21.946 0.54378 21.4936 0.853867 21.1154 1.24262L21.1182 1.23177Z" fill="white"/>
                                                                                    </svg>
                                                                                    : <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="20">
                                                                                        <path d="M380.9 97.1c-41.9-42-97.7-65.1-157-65.1-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480 117.7 449.1c32.4 17.7 68.9 27 106.1 27l.1 0c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3 18.6-68.1-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1s56.2 81.2 56.1 130.5c0 101.8-84.9 184.6-186.6 184.6zM325.1 300.5c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8s-14.3 18-17.6 21.8c-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7 .9-6.9-.5-9.7s-12.5-30.1-17.1-41.2c-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2s-9.7 1.4-14.8 6.9c-5.1 5.6-19.4 19-19.4 46.3s19.9 53.7 22.6 57.4c2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4s4.6-24.1 3.2-26.4c-1.3-2.5-5-3.9-10.5-6.6z" fill="#ffffff"/>
                                                                                    </svg>
                                                                            }
                                                                        </button>
                                                                    </td>
                                                                </tr>
                                                            ))
                                                        }

                                                        {
                                                            transport.patients.length < 15 ? (
                                                                <tr className="transport-row">
                                                                    <td className="transport-index">{transport.patients.length + 1}</td>
                                                                    <td className="transport-info start"></td>
                                                                    <td className="transport-info"></td>
                                                                    <td className="transport-info"></td>
                                                                    <td className="transport-info"></td>
                                                                    <td className="transport-info"></td>
                                                                    <td className="transport-info end"></td>
                                                                    <td className="transport-actions">
                                                                        <button data-transport-id={transport._id} onClick={toggleNewPatientContainer}>
                                                                            <svg width="22" viewBox="0 0 34 33" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                            <g clip-path="url(#clip0_2642_4404)">
                                                                            <path d="M16.9789 0.405273C13.7807 0.405273 10.6543 1.35364 7.99515 3.13045C5.33596 4.90727 3.26338 7.43272 2.03949 10.3874C0.8156 13.3422 0.495375 16.5935 1.11931 19.7302C1.74324 22.8669 3.28331 25.7482 5.54476 28.0096C7.80621 30.2711 10.6875 31.8112 13.8242 32.4351C16.9609 33.059 20.2122 32.7388 23.167 31.5149C26.1217 30.291 28.6471 28.2184 30.4239 25.5593C32.2008 22.9001 33.1491 19.7737 33.1491 16.5755C33.1445 12.2883 31.4394 8.17806 28.4078 5.14655C25.3763 2.11505 21.2661 0.40991 16.9789 0.405273V0.405273ZM16.9789 28.7032C14.5802 28.7032 12.2355 27.992 10.2411 26.6593C8.24669 25.3267 6.69225 23.4327 5.77433 21.2166C4.85642 19.0006 4.61625 16.5621 5.0842 14.2095C5.55215 11.857 6.7072 9.69605 8.40329 7.99996C10.0994 6.30387 12.2603 5.14882 14.6129 4.68087C16.9654 4.21292 19.4039 4.45309 21.6199 5.37101C23.836 6.28892 25.7301 7.84336 27.0627 9.83775C28.3953 11.8321 29.1066 14.1769 29.1066 16.5755C29.103 19.7909 27.8241 22.8736 25.5505 25.1472C23.2769 27.4208 20.1942 28.6997 16.9789 28.7032ZM23.7165 16.5755C23.7165 17.1116 23.5035 17.6257 23.1245 18.0048C22.7454 18.3839 22.2313 18.5968 21.6952 18.5968H19.0001V21.2919C19.0001 21.8279 18.7872 22.3421 18.4081 22.7211C18.0291 23.1002 17.5149 23.3131 16.9789 23.3131C16.4428 23.3131 15.9287 23.1002 15.5496 22.7211C15.1705 22.3421 14.9576 21.8279 14.9576 21.2919V18.5968H12.2625C11.7265 18.5968 11.2123 18.3839 10.8333 18.0048C10.4542 17.6257 10.2413 17.1116 10.2413 16.5755C10.2413 16.0395 10.4542 15.5253 10.8333 15.1463C11.2123 14.7672 11.7265 14.5543 12.2625 14.5543H14.9576V11.8592C14.9576 11.3231 15.1705 10.809 15.5496 10.4299C15.9287 10.0509 16.4428 9.83793 16.9789 9.83793C17.5149 9.83793 18.0291 10.0509 18.4081 10.4299C18.7872 10.809 19.0001 11.3231 19.0001 11.8592V14.5543H21.6952C22.2313 14.5543 22.7454 14.7672 23.1245 15.1463C23.5035 15.5253 23.7165 16.0395 23.7165 16.5755Z" fill="#FFFFFF"/>
                                                                            </g>
                                                                            <defs>
                                                                            <clipPath id="clip0_2642_4404">
                                                                            <rect width="32.3405" height="32.3405" fill="white" transform="translate(0.808594 0.405273)"/>
                                                                            </clipPath>
                                                                            </defs>
                                                                            </svg>
                                                                        </button>
                                                                    </td>
                                                                </tr> 
                                                            ) : null
                                                        }

                                                        
                                                    </tbody>
                                                </table>
                                            </div>

                                            <div className="transport-controls-container">
                                                <button className="delete-transport" onClick={() => handleDeleteTransport(transport._id)}>Excluir transporte</button>
                                                <button className="print-transport" onClick={() => goPrint(transport._id)}>Imprimir</button>
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
                                        <circle cx="33.5" cy="33.5" r="33.5" transform="rotate(-180 33.5 33.5)" fill="#161179"/>
                                        <path d="M37.2467 45.2681C37.4855 45.0359 37.675 44.7602 37.8042 44.4568C37.9335 44.1534 38 43.8282 38 43.4998C38 43.1713 37.9335 42.8461 37.8042 42.5427C37.675 42.2393 37.4855 41.9636 37.2467 41.7315L29.3918 34.0883C29.2312 33.932 29.141 33.7201 29.141 33.4991C29.141 33.2782 29.2312 33.0662 29.3918 32.91L37.2467 25.2685C37.7288 24.7997 37.9997 24.1638 37.9999 23.5007C38.0001 22.8377 37.7295 22.2017 37.2476 21.7327C36.7658 21.2637 36.1121 21.0002 35.4305 21C34.7489 20.9998 34.0952 21.2631 33.6131 21.7319L25.7564 29.375C25.1996 29.9167 24.7579 30.5598 24.4565 31.2675C24.1551 31.9753 24 32.7339 24 33.5C24 34.266 24.1551 35.0246 24.4565 35.7324C24.7579 36.4401 25.1996 37.0832 25.7564 37.6249L33.6131 45.2681C34.095 45.7367 34.7485 46 35.4299 46C36.1113 46 36.7648 45.7367 37.2467 45.2681Z" fill="#FFFAE6"/>
                                    </svg>

                                    Veículo Anterior
                                </button>
                                <button onClick={nextTransport}>
                                    Próximo Veículo

                                    <svg width="40" height="40" viewBox="0 0 67 67" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <circle cx="33.5" cy="33.5" r="33.5" fill="#161179"/>
                                        <path d="M29.7532 21.7319C29.5144 21.9641 29.325 22.2398 29.1958 22.5432C29.0665 22.8466 29 23.1718 29 23.5002C29 23.8287 29.0665 24.1539 29.1958 24.4573C29.325 24.7607 29.5145 25.0364 29.7532 25.2685L37.6082 32.9117C37.7688 33.068 37.859 33.2799 37.859 33.5009C37.859 33.7218 37.7688 33.9338 37.6082 34.09L29.7533 41.7315C29.2712 42.2003 29.0003 42.8362 29.0001 43.4993C28.9999 44.1623 29.2705 44.7983 29.7524 45.2673C30.2342 45.7363 30.8879 45.9998 31.5695 46C32.2511 46.0002 32.9048 45.7369 33.3869 45.2681L41.2436 37.625C41.8004 37.0833 42.2421 36.4402 42.5435 35.7325C42.8449 35.0247 43 34.2661 43 33.5C43 32.734 42.8449 31.9754 42.5435 31.2676C42.2421 30.5599 41.8004 29.9168 41.2436 29.3751L33.3869 21.7319C32.905 21.2633 32.2515 21 31.5701 21C30.8887 21 30.2352 21.2633 29.7532 21.7319Z" fill="#FFFAE6"/>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    )
                }

            </div>
            <div className="bottom-container transport">
                <div className="user-info-container">
                    <b id="user-name">{(userData as user).name.split(" ")[0] + " " + (userData as user).name.split(" ")[1]}</b>
                    <button id="logout" onClick={() => window.location.href = "/"}>
                        <img src={logoutIcon} alt="Sair" />
                        Trocar módulo
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
                            <input type="text" name="name" id="patientNameEl" placeholder="Digite o nome do paciente" onChange={handleNewPatientChange} required/>
                        </div>
                        <div className="form-wrapper">
                            <span>Endereço:</span>
                            <input type="text" name="address" id="addressEl" placeholder="Digite o endereço" onChange={handleNewPatientChange} required/>
                        </div>
                        <div className="form-wrapper horizontal">
                            <div>
                                <span>CPF:</span>
                                <input type="text" name="docId" id="docIdEl" placeholder="Digite o CPF" onChange={handleNewPatientChange} required value={newPatientData.docId}/>
                            </div>
                            <div>
                                <span>Telefone:</span>
                                <input type="text" name="phone" id="patientPhoneEl" placeholder="Ex.: 557988888888" onChange={handleNewPatientChange} required/>
                            </div>
                        </div>
                        <div className="form-wrapper">
                            <span>Pegar em:</span>
                            <input type="text" name="pickupLocation" id="pickupLocationEl" placeholder="Digite o local de retirada" onChange={handleNewPatientChange} required/>
                        </div>
                        <div className="form-wrapper">
                            <span>Destino:</span>
                            <input type="text" name="destination" id="destinationEl" placeholder="Digite o destino" onChange={handleNewPatientChange} required/>
                        </div>

                        <button type="submit">Cadastrar</button>
                    </form>
                </div>
            </div>

            <div className="new-exame-container hidden" id="newVehicleContainer">
                <div className="new-exame-wrapper">
                    <div className="top-buttons-wrapper">
                        <button className="back" onClick={toggleNewVehicleContainer}>
                            Voltar
                        </button>
                    </div>

                    <form className="new-exame-info" id="newVehicleForm" onSubmit={handleNewVehicleSubmit}>
                        <div className="form-wrapper horizontal">
                            <div>
                                <span>Descrição:</span>
                                <input type="text" name="description" id="descriptionEl" placeholder="Digite a descrição" onChange={handleNewVehicleChange} required />
                            </div>
                            <div>
                                <span>Placa:</span>
                                <input type="text" name="plate" id="plateEl" placeholder="Digite a placa" onChange={handleNewVehicleChange} required />
                            </div>
                        </div>
                        

                        <button type="submit">Cadastrar</button>
                    </form>

                    <div className="exame-types">
                        <b>Destinos cadastrados:</b>

                        <div className="exame-types-list">
                            {vehicles.map((vehicle) => (
                                <div className="exame-type-item" key={vehicle._id}>
                                    <span>{vehicle.description} - {vehicle.plate}</span>
                                    <button className="delete-btn" data-vehicle-id={vehicle._id} onClick={handleDeleteVehicle}>
                                        X
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="new-exame-container hidden" id="newDestinationContainer">
                <div className="new-exame-wrapper">
                    <div className="top-buttons-wrapper">
                        <button className="back" onClick={toggleNewDestinationContainer}>
                            Voltar
                        </button>
                    </div>

                    <form className="new-exame-type-info" id="newDestinationForm" onSubmit={handleAddDestination}>
                        <div className="form-wrapper">
                            <span>Novo Destino:</span>
                            <div className="type-wrapper">
                                <input type="text" name="location" id="newLocationEl" placeholder="Digite o novo destino" onChange={handleSetDestination} required />
                                <button type="submit">
                                    <svg width="28" height="22" viewBox="0 0 28 22" fill="none" xmlns="http://www.w3.org/2000/svg" style={{width: "20px", height: "20px"}}>
                                        <path d="M20.9951 1.24614L9.32718 13.0341L7.01479 10.6156C6.64386 10.2257 6.20055 9.91343 5.71017 9.69663C5.21979 9.47983 4.69195 9.36273 4.15677 9.35203C3.6216 9.34132 3.08958 9.43721 2.59109 9.63423C2.0926 9.83125 1.6374 10.1255 1.25148 10.5003C0.865565 10.875 0.556485 11.3229 0.341893 11.8183C0.1273 12.3137 0.0113974 12.847 0.000799916 13.3877C-0.0206027 14.4797 0.388228 15.5355 1.13736 16.3229L4.56926 19.9301C5.1642 20.5683 5.87922 21.08 6.67241 21.4355C7.46561 21.7909 8.32105 21.9828 9.1886 22H9.29729C11.0196 21.9957 12.6707 21.3051 13.8922 20.0783L26.7557 7.07973C27.145 6.69988 27.4555 6.2455 27.6691 5.74311C27.8827 5.24072 27.9951 4.70037 27.9998 4.15361C28.0045 3.60685 27.9014 3.06461 27.6965 2.55855C27.4915 2.05248 27.1889 1.59272 26.8062 1.20608C26.4235 0.819451 25.9684 0.513689 25.4675 0.306641C24.9666 0.0995928 24.4299 -0.00459574 23.8887 0.000155475C23.3475 0.00490669 22.8127 0.118502 22.3154 0.334314C21.8181 0.550125 21.3684 0.86383 20.9924 1.25712L20.9951 1.24614Z" fill="white"/>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </form>

                    <div className="exame-types">
                        <b>Destinos cadastrados:</b>

                        <div className="exame-types-list">
                            {destinations.map((destination) => (
                                <div className="exame-type-item" key={destination.location}>
                                    <span>{destination.location}</span>
                                    <button className="delete-btn" data-destination-id={destination._id} onClick={handleRemoveDestination}>
                                        X
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="new-exame-container hidden" id="newDriverContainer">
                <div className="new-exame-wrapper">
                    <div className="top-buttons-wrapper">
                        <button className="back" onClick={toggleNewDriverContainer}>
                            Voltar
                        </button>
                    </div>

                    <form className="new-exame-info" id="newDriverForm" onSubmit={handleAddDriver}>
                        <div className="form-wrapper horizontal">
                            <div>
                                <span>Nome:</span>
                                <input type="text" name="name" id="nameEl" placeholder="Digite o nome do motorista" onChange={handleNewDriverChange} required />
                            </div>
                            <div>
                                <span>CPF:</span>
                                <input type="text" name="docId" id="docIdEl" placeholder="Digite o CPF" onChange={handleNewDriverChange} required />
                            </div>
                        </div>

                        <button type="submit">Cadastrar</button>
                    </form>

                    <div className="exame-types">
                        <b>Motoristas cadastrados:</b>

                        <div className="exame-types-list">
                            {drivers.map((driver) => (
                                <div className="exame-type-item" key={driver._id}>
                                    <span>{driver.name} - {driver.docId}</span>
                                    <button className="delete-btn" data-driver-id={driver._id} onClick={handleDeleteDriver}>
                                        X
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
}

export default TransportsPanel;