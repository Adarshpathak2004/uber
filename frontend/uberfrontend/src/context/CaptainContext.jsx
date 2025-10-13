import React, { createContext, useContext, useState, useEffect } from "react";

const CaptainDataContext = React.createContext();


export function CaptainContext({ children }) {
    const [captains, setCaptains] = useState([]);
    const [selectedCaptain, setSelectedCaptain] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Example fetch - adapt URL to your backend
    const fetchCaptains = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch("/api/captains");
            if (!res.ok) throw new Error("Failed to load captains");
            const data = await res.json();
            setCaptains(data);
        } catch (e) {
            setError(e.message || "Unknown error");
        } finally {
            setLoading(false);
        }
    };

    const createCaptain = async (payload) => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch("/api/captains", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            if (!res.ok) throw new Error("Failed to create captain");
            const created = await res.json();
            setCaptains((prev) => [created, ...prev]);
            return created;
        } catch (e) {
            setError(e.message || "Unknown error");
            throw e;
        } finally {
            setLoading(false);
        }
    };

    const updateCaptain = async (id, updates) => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`/api/captains/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updates),
            });
            if (!res.ok) throw new Error("Failed to update captain");
            const updated = await res.json();
            setCaptains((prev) => prev.map((c) => (c.id === id ? updated : c)));
            if (selectedCaptain?.id === id) setSelectedCaptain(updated);
            return updated;
        } catch (e) {
            setError(e.message || "Unknown error");
            throw e;
        } finally {
            setLoading(false);
        }
    };

    const deleteCaptain = async (id) => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`/api/captains/${id}`, { method: "DELETE" });
            if (!res.ok) throw new Error("Failed to delete captain");
            setCaptains((prev) => prev.filter((c) => c.id !== id));
            if (selectedCaptain?.id === id) setSelectedCaptain(null);
        } catch (e) {
            setError(e.message || "Unknown error");
            throw e;
        } finally {
            setLoading(false);
        }
    };

    const clearError = () => setError(null);
    const clearSelected = () => setSelectedCaptain(null);

    useEffect(() => {
        // optional: auto-load on mount
        fetchCaptains();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const value = {
        captains,
        selectedCaptain,
        setSelectedCaptain,
        loading,
        error,
        fetchCaptains,
        createCaptain,
        updateCaptain,
        deleteCaptain,
        clearError,
        clearSelected,
    };

    return (
        <CaptainDataContext.Provider value={value}>
            {children}
        </CaptainDataContext.Provider>
    );
}

// Export the context as a named export and the provider as the default
export { CaptainDataContext };
export default CaptainContext;