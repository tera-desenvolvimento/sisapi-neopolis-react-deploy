import React, { useState, useRef } from "react";
import { useReactToPrint } from 'react-to-print';
import { useParams } from "react-router-dom";
import findTransport from "../controllers/transports/findTransport.controller";
import listDrivers from "../controllers/transports/listDrivers.controller";
import listVehicles from "../controllers/transports/listVehicles.controller";

import pdfLogo from "../img/pdf-logo.svg";

type Patient = {
    name: string,
    address: string,
    docId: string,
    phone: string,
    pickupLocation: string,
    destination: string
}

type Transport = {
    _id: string,
	date: string,
	exitTime: string,
	restTime: string,
	returnTime: string,
	arriveTime: string,
	destination: string,
	vehicleId: string,
	patients: Array<Patient>,
	driverId: string,
}

type Driver = {
    _id: string,
    name: string,
    docId: string
}

type Vehicle = {
    _id: string,
    description: string,
    plate: string
}

const PrintTransport = () => {
    const { id } = useParams();
    const componentRef = useRef<HTMLDivElement>(null);
    const [transportData, setTransportData] = useState<Transport>({} as Transport);
    const [loaded, setLoaded] = useState(false);
    const [driversData, setDriversData] = useState<Driver[]>([]);
    const [vehiclesData, setVehiclesData] = useState<Vehicle[]>([]);

    if (!loaded) {
        findTransport(id as string)
            .then((data) => {
                setTransportData(data);
            })

        listDrivers()
            .then((data) => {
                setDriversData(data.drivers);
            })

        listVehicles()
            .then((data) => {
                setVehiclesData(data);
            })

        setLoaded(true);
    }

    const handlePrint = useReactToPrint({
        documentTitle: 'Relatório de Transportes',
        pageStyle: '@page { size: A4 landscape; margin: 0 !important }',
        contentRef: componentRef,
        onAfterPrint() {
            window.close();
        },
    });

    return (
        <React.Fragment>
            <div className="main-page" style={{ width: "-webkit-fill-available", padding: "18px", fontSize: "90%" }} ref={componentRef}>
                <div className="page-header" style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: "18px", marginBottom: "36px", textAlign: "center" }}>
                    <img src={pdfLogo} alt="PDF Logo" style={{ width: "108px", height: "auto" }} />
                    <span style={{ fontSize: "10.8px", fontFamily: "Poppins-Regular" }}>RELAÇÃO DE PACIENTES QUE REALIZAM TRATAMENTO FORA DO MUNICÍPIO <br /> QUE SERÃO TRANSPORTADOS PELO VEÍCULO MUNICIPAL VINCULADO À SECRETARIA</span>
                </div>
                <div className="transport-details" style={{ marginBottom: "18px", fontFamily: "Poppins-Regular", fontSize: "9px", display: "flex", flexDirection: "column", gap: "9px" }}>
                    <div className="row" style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between" }}>
                        <div className="separator">
                            <b>MOTORISTA: {driversData.find(driver => driver._id === transportData.driverId)?.name.split(" ")[0]}</b>
                        </div>
                        <div className="separator">
                            <b>DATA: {transportData.date}</b>
                        </div>
                        <div className="separator">
                            <b>HORÁRIO: {transportData.exitTime}</b>
                        </div>
                        <div className="separator">
                            <b>DESTINO: {transportData.destination}</b>
                        </div>
                        <div className="separator">
                            <b>VEÍCULO: {vehiclesData.find(vehicle => vehicle._id === transportData.vehicleId)?.description}</b>
                        </div>
                        <div className="separator">
                            <b>PLACA: {vehiclesData.find(vehicle => vehicle._id === transportData.vehicleId)?.plate}</b>
                        </div>
                    </div>
                    <div className="row" style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between" }}>
                        <div className="separator">
                            <b>HORÁRIO PREVISTO DE SAÍDA NEÓPOLIS: {transportData.exitTime}</b>
                        </div>
                        <div className="separator">
                            <b>HORÁRIO PREVISTO DE DESCANSO: {transportData.restTime}</b>
                        </div>
                        <div className="separator">
                            <b>HORÁRIO PREVISTO DE SAÍDA {transportData.destination}: {transportData.returnTime}</b>
                        </div>
                        <div className="separator">
                            <b>HORÁRIO PREVISTO DE CHEGADA: {transportData.arriveTime}</b>
                        </div>
                    </div>
                </div>
                <div className="table-container">
                    <table className="patients-table" style={{ width: "100%", borderCollapse: "collapse", fontFamily: "Poppins-Regular", fontSize: "9px", borderStyle: "hidden", boxShadow: "0 0 0 1px #ccc" }}>
                        <thead>
                            <tr>
                                <th style={{ textAlign: "left", padding: "4.5px", border: "1px solid #ccc"}}><b>Paciente:</b></th>
                                <th style={{ textAlign: "left", padding: "4.5px", border: "1px solid #ccc"}}><b>Endereço:</b></th>
                                <th style={{ textAlign: "left", padding: "4.5px", border: "1px solid #ccc"}}><b>Pegar em:</b></th>
                                <th style={{ textAlign: "left", padding: "4.5px", border: "1px solid #ccc"}}><b>Destino:</b></th>
                                <th style={{ textAlign: "left", padding: "4.5px", border: "1px solid #ccc"}}><b>Telefone:</b></th>
                                <th style={{ textAlign: "left", padding: "4.5px", border: "1px solid #ccc"}}><b>Assinatura:</b></th>
                            </tr>
                        </thead>
                        <tbody>
                            {transportData.patients ? transportData.patients.map((patient, index) => (
                                <tr key={patient.docId} style={{ display:"table-row" }}>
                                    <td style={{ textAlign: "left", padding: "4.5px", border: "1px solid #ccc" }}>{index + 1}. {patient.name}</td>
                                    <td style={{ textAlign: "left", padding: "4.5px", border: "1px solid #ccc" }}>{patient.address}</td>
                                    <td style={{ textAlign: "left", padding: "4.5px", border: "1px solid #ccc" }}>{patient.pickupLocation}</td>
                                    <td style={{ textAlign: "left", padding: "4.5px", border: "1px solid #ccc" }}>{patient.destination}</td>
                                    <td style={{ textAlign: "left", padding: "4.5px", border: "1px solid #ccc" }}>{patient.phone}</td>
                                    <td style={{ textAlign: "left", padding: "4.5px", border: "1px solid #ccc", width: "22.5%" }}>{index + 1}.</td>
                                </tr>
                            )) : ""}
                        </tbody>
                    </table>
                    <div className="signatures-container" style={{ marginTop: "70px", display: "flex", justifyContent: "space-between", fontFamily: "Poppins-Bold", fontSize: "9px" }}>
                        <div className="signature" style={{ textAlign: "center" }}>
                            <p>________________________________________________________________</p>
                            <p>Assinatura do Motorista</p>
                        </div>
                        <div className="signature" style={{ textAlign: "center" }}>
                            <p>________________________________________________________________</p>
                            <p>Assinatura da Coordenação de Transportes do Município</p>
                        </div>
                    </div>

                    <div className="footer" style={{ marginTop: "25px", textAlign: "center", fontFamily: "Poppins-Regular", fontSize: "10.8px", color: "#555" }}>
                        <span>CNPJ: 13.111.679/0001-38 - RUA DO BOMFIM, 565, CENTRO - NEÓPOLIS/SE - CEP: 49,980-000 - TELEFONE: 79 3344-1277 / 79 3344-1749</span>
                    </div>
                </div>
            </div>

            <div className="control">
                <button onClick={handlePrint} style={{ padding: "10px 20px", fontSize: "12px", cursor: "pointer", backgroundColor: "#4CAF50", color: "white", border: "none", borderRadius: "4px" }}>Imprimir</button>
            </div>
        </React.Fragment>
    );
};

export default PrintTransport;
