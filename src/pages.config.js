import Home from './pages/Home';
import Services from './pages/Services';
import Gallery from './pages/Gallery';
import About from './pages/About';
import FAQ from './pages/FAQ';
import Contact from './pages/Contact';
import Booking from './pages/Booking';
import Layout from './Layout.jsx';


export const PAGES = {
    "Home": Home,
    "Services": Services,
    "Gallery": Gallery,
    "About": About,
    "FAQ": FAQ,
    "Contact": Contact,
    "Booking": Booking,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: Layout,
};