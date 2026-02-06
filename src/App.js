import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export default function App() {
    return (_jsxs("div", { style: {
            minHeight: '100vh',
            backgroundColor: '#0f172a',
            color: '#e5e7eb',
            padding: '24px',
            fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
        }, children: [_jsx("h1", { style: { fontSize: '2rem', marginBottom: '16px' }, children: "Section E" }), _jsx(Section, { title: "Dramas", items: ['K-Drama', 'C-Drama', 'J-Drama'] }), _jsx(Section, { title: "Movies", items: ['Action', 'Romance', 'Thriller'] }), _jsx(Section, { title: "Studies", items: ['Notes', 'Exams', 'Resources'] }), _jsx("h2", { style: { marginTop: '32px' }, children: "Featured Drama Episode" }), _jsx("div", { style: {
                    marginTop: '12px',
                    position: 'relative',
                    paddingTop: '56.25%', // 16:9
                }, children: _jsx("iframe", { src: "https://www.youtube.com/embed/U6dQei2YD6M", title: "Ang Mutya Ng Section E Episode 1", style: {
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        border: 'none',
                    }, allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture", allowFullScreen: true }) })] }));
}
function Section({ title, items, }) {
    return (_jsxs("div", { style: { marginBottom: '16px' }, children: [_jsx("h2", { children: title }), _jsx("ul", { children: items.map((item) => (_jsx("li", { children: item }, item))) })] }));
}
