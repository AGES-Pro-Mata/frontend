import { useEffect, useState } from "react";

const expirienceTypes = ["Quartos", "Eventos", "Labortórios", "Trilhas"];

export function ExperienceFilter({ experiences, onFilter }) {
    const [selectedType, setSelectedType] = useState(experiences);
    const [search, setSearch] = useState("");
    const [startDate, setStartDate] = useState(""); 
    const [endDate, setEndDate] = useState("");

    useEffect(() => {
        const filtered = experiences
        .filter(exp => exp.type === selectedType)
        .filter(exp => exp.name.toLowerCase().includes(search.toLowerCase()) || exp.description.toLowerCase().includes(search.toLowerCase()))
        .filter(exp => {
            if(!startDate && !endDate) return true;
            const expDate = new Date(exp.date);
            return (!startDate || expDate >= new Date(startDate)) && (!endDate || expDate <= new Date(endDate));
        });
        onFilter(filtered);
    }, [selectedType, search, startDate, endDate, experiences]);
}