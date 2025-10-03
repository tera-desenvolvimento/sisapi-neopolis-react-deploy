import React, { useState } from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import { ptBR } from 'date-fns/locale/pt-BR';

import "react-datepicker/dist/react-datepicker.css";
import arrowImg from "../img/drop-arrow.svg";

import "../style/dateSelector.css";

function getYear(date: Date) {
    return date.getFullYear();
}

function getMonth(date: Date) {
    return date.getMonth();
}


registerLocale('pt-BR', ptBR);

type DateSelectorProps = {
  value: Date;
  onChange: (date: Date) => void;
  visible: boolean;
};

function DateSelector({ value, onChange, visible }: DateSelectorProps) {
    const actualDate = new Date();
    actualDate.setHours(actualDate.getHours()); // Reset time to midnight
    
    const years = Array.from({ length: getYear(new Date()) - 2000 + 1 }, (_, i) => 2000 + i);
    const months = [
        "Janeiro",
        "Fevereiro",
        "Março",
        "Abril",
        "Maio",
        "Junho",
        "Julho",
        "Agosto",
        "Setembro",
        "Outubro",
        "Novembro",
        "Dezembro"
    ];

    return (
        <div className={`date-picker-container ${!visible ? "hidden" : ""}`}>
            <DatePicker
                renderCustomHeader={({ date, changeYear, changeMonth, decreaseMonth, increaseMonth, prevMonthButtonDisabled, nextMonthButtonDisabled }) => {
                    return (
                        <div style={{ margin: 10, display: "flex", justifyContent: "center", gap: "10px", alignItems: "center" }}>

                            <select value={months[getMonth(date)]} onChange={({ target: { value } }) => changeMonth(months.indexOf(value))} style={{ height: 30 ,borderRadius: "6px", boxShadow: "0 1px 1px 0 rgba(0, 14, 51, 0.05)", textAlign: "center", fontFamily: "jakarta-regular", fontSize: "13px", fontStyle: "normal", fontWeight: 700, lineHeight: "100%", letterSpacing: "-0.24px", backgroundColor: "#F5F7FA", border: "1px solid #E5E7EB", padding: '5px', paddingRight: '10px', cursor: "pointer" }}>
                                {months.map((option) => (
                                    <option key={option} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </select>

                            <select value={getYear(date)} onChange={({ target: { value } }) => changeYear(Number(value))} style={{ height: 30, borderRadius: "6px", boxShadow: "0 1px 1px 0 rgba(0, 14, 51, 0.05)", textAlign: "center", fontFamily: "jakarta-regular", fontSize: "13px", fontStyle: "normal", fontWeight: 700, lineHeight: "100%", letterSpacing: "-0.24px", backgroundColor: "#F5F7FA", border: "1px solid #E5E7EB", padding: '5px', paddingRight: '10px', cursor: "pointer" }}>
                                {years.map((option) => (
                                    <option key={option} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </select>
                            <button onClick={decreaseMonth} disabled={prevMonthButtonDisabled} style={{ height: 30 ,borderRadius: "6px", boxShadow: "0 1px 1px 0 rgba(0, 14, 51, 0.05)", textAlign: "center", fontFamily: "jakarta-regular", fontSize: "13px", fontStyle: "normal", fontWeight: 700, lineHeight: "100%", letterSpacing: "-0.24px", backgroundColor: "#F5F7FA", border: "1px solid #E5E7EB", padding: '5px 10px', cursor: "pointer"}}>
                                <svg width="6" height="9" viewBox="0 0 6 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M5.14055 0.684156C4.84536 0.388973 4.36853 0.388973 4.07334 0.684156L0.599257 4.15824C0.304073 4.45343 0.304073 4.93026 0.599257 5.22545L4.07334 8.69953C4.36853 8.99472 4.84536 8.99472 5.14055 8.69953C5.43573 8.40435 5.43573 7.92751 5.14055 7.63233L2.20385 4.68806L5.14055 1.75136C5.43573 1.45618 5.42816 0.971771 5.14055 0.684156Z" fill="#323232"/>
                                </svg>
                            </button>

                            <button onClick={increaseMonth} disabled={nextMonthButtonDisabled} style={{ height: 30 ,borderRadius: "6px", boxShadow: "0 1px 1px 0 rgba(0, 14, 51, 0.05)", textAlign: "center", fontFamily: "jakarta-regular", fontSize: "13px", fontStyle: "normal", fontWeight: 700, lineHeight: "100%", letterSpacing: "-0.24px", backgroundColor: "#F5F7FA", border: "1px solid #E5E7EB", padding: '5px 10px', cursor: "pointer"}}>
                                <svg width="6" height="9" viewBox="0 0 6 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M0.75545 8.3239C1.05063 8.61908 1.52747 8.61908 1.82265 8.3239L5.29674 4.84981C5.59192 4.55463 5.59192 4.07779 5.29674 3.78261L1.82265 0.308524C1.52747 0.0133413 1.05063 0.0133413 0.755449 0.308525C0.460265 0.603709 0.460265 1.08054 0.755449 1.37573L3.69215 4.32L0.75545 7.2567C0.460266 7.55188 0.467834 8.03629 0.75545 8.3239Z" fill="#323232"/>
                                </svg>
                            </button>
                        </div>
                    )
                }}
                selected={value}
                onChange={(date) => onChange(date ?? new Date())}
                locale="pt-BR"
                inline={true}
                calendarStartDay={0}
                filterDate={(date) => {
                    const day = date.getDay();
                    return day !== 0 && day !== 6;
                }}
            />
        </div>
    );
}

export default DateSelector;


