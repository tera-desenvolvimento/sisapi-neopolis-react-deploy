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
};

function DateSelector({ value, onChange }: DateSelectorProps) {
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
        <div className="date-picker-container">
            <DatePicker
                renderCustomHeader={({ date, changeYear, changeMonth, decreaseMonth, increaseMonth, prevMonthButtonDisabled, nextMonthButtonDisabled }) => {
                    return (
                        <div style={{ margin: 10, display: "flex", justifyContent: "center", gap: "10px", alignItems: "center" }}>
                            <button onClick={decreaseMonth} disabled={prevMonthButtonDisabled} style={{ borderRadius: "50%", backgroundColor: "#FFF", boxShadow: "0 1px 1px 0 rgba(0, 14, 51, 0.05)", width: "30px", height: "30px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M13.8818 20.5586C12.6565 18.108 10.8006 16.2411 9.21875 14.9756C8.43239 14.3465 7.72561 13.8758 7.21973 13.5645C6.96738 13.4092 6.76598 13.2943 6.63086 13.2197C6.56331 13.1825 6.51175 13.1556 6.47949 13.1387C6.46343 13.1302 6.45186 13.1235 6.44531 13.1201C6.44369 13.1193 6.44238 13.1187 6.44141 13.1182L6.44141 10.8828C6.44241 10.8823 6.44346 10.8808 6.44531 10.8799C6.45181 10.8766 6.46362 10.8706 6.47949 10.8623C6.51175 10.8454 6.56331 10.8175 6.63086 10.7803C6.76598 10.7057 6.96739 10.5908 7.21973 10.4355C7.72571 10.1242 8.43221 9.65268 9.21875 9.02344C10.8007 7.75785 12.6565 5.8912 13.8818 3.44043L15 4L16.1182 4.55859C14.677 7.44107 12.5325 9.57446 10.7812 10.9756C10.2846 11.3729 9.81461 11.7139 9.39648 12C9.8146 12.2861 10.2847 12.6262 10.7812 13.0234C12.5326 14.4245 14.6769 16.5587 16.1182 19.4414L13.8818 20.5586Z" fill="black"/>
                                </svg>
                            </button>

                            <select value={months[getMonth(date)]} onChange={({ target: { value } }) => changeMonth(months.indexOf(value))} style={{ height: 30 ,borderRadius: "6px", boxShadow: "0 1px 1px 0 rgba(0, 14, 51, 0.05)", textAlign: "center", fontFamily: "Poppins-Bold", fontSize: "13px", fontStyle: "normal", fontWeight: 700, lineHeight: "100%", letterSpacing: "-0.24px", background: `url(${arrowImg}) no-repeat right 5px center`, appearance: 'none', padding: '5px', paddingRight: '10px', backgroundColor: "#FFF" }}>
                                {months.map((option) => (
                                    <option key={option} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </select>

                            <select value={getYear(date)} onChange={({ target: { value } }) => changeYear(Number(value))} style={{ height: 30, borderRadius: "6px", boxShadow: "0 1px 1px 0 rgba(0, 14, 51, 0.05)", textAlign: "center", fontFamily: "Poppins-Bold", fontSize: "13px", fontStyle: "normal", fontWeight: 700, lineHeight: "100%", letterSpacing: "-0.24px", background: `url(${arrowImg}) no-repeat right 5px center`, appearance: 'none', padding: '5px', paddingRight: '10px', backgroundColor: "#FFF" }}>
                                {years.map((option) => (
                                    <option key={option} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </select>

                            <button onClick={increaseMonth} disabled={nextMonthButtonDisabled} style={{ borderRadius: "50%", backgroundColor: "#FFF", boxShadow: "0 1px 1px 0 rgba(0, 14, 51, 0.05)", width: "30px", height: "30px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M10.1182 20.5586C11.3435 18.108 13.1994 16.2411 14.7813 14.9756C15.5676 14.3465 16.2744 13.8758 16.7803 13.5645C17.0326 13.4092 17.234 13.2943 17.3691 13.2197C17.4367 13.1825 17.4883 13.1556 17.5205 13.1387C17.5366 13.1302 17.5481 13.1235 17.5547 13.1201C17.5563 13.1193 17.5576 13.1187 17.5586 13.1182L17.5586 10.8828C17.5576 10.8823 17.5565 10.8808 17.5547 10.8799C17.5482 10.8766 17.5364 10.8706 17.5205 10.8623C17.4883 10.8454 17.4367 10.8175 17.3691 10.7803C17.234 10.7057 17.0326 10.5908 16.7803 10.4355C16.2743 10.1242 15.5678 9.65268 14.7813 9.02344C13.1993 7.75785 11.3435 5.8912 10.1182 3.44043L9 4L7.88184 4.55859C9.32303 7.44107 11.4675 9.57446 13.2188 10.9756C13.7154 11.3729 14.1854 11.7139 14.6035 12C14.1854 12.2861 13.7153 12.6262 13.2188 13.0234C11.4674 14.4245 9.32315 16.5587 7.88184 19.4414L10.1182 20.5586Z" fill="black"/>
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


