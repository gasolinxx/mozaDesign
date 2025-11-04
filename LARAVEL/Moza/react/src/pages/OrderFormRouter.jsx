import { useParams } from 'react-router-dom';

// Import all order form components
import Banner from '../productPage/Banner';
import Bunting from '../productPage/Bunting';
import Signboard from '../productPage/Signboard';
import Sampul from '../productPage/SampulRaya';
import Billbook from '../productPage/Billbook';
import Perspek from '../productPage/Perspek';
import Sticker from '../productPage/StikerProduk';
import DigitalPrint from '../productPage/DigitalPrint';
import Booklet from '../productPage/Booklet';
import Flyers from '../productPage/Flyers';
import Brochure from '../productPage/Brochure';
import BussinessCard from '../productPage/BussinessCard';
import Stamp from '../productPage/Stamp';
import Mug from '../productPage/Mug';
import Lanyard from '../productPage/Lanyard';
import Foamboard from '../productPage/Foamboard';
import ButtonBadge from '../productPage/Buttonbadge';
import Frame from '../productPage/Frame';
import Calendar from '../productPage/Calendar';
import SublimationShirt from '../productPage/SublimationShirt';
import Totebag from '../productPage/Totebag';

const OrderFormRouter = () => {
  const { productName, id } = useParams();

  const components = {
    banner: Banner,
    bunting: Bunting,
    signboard: Signboard,
    sampul: Sampul,
    billbook: Billbook,
    perspek: Perspek,
    sticker: Sticker,
    digitalprint: DigitalPrint,
    booklet: Booklet,
    flyers: Flyers,
    brochure: Brochure,
    bussinesscard: BussinessCard,
    stamp: Stamp,
    mug: Mug,
    lanyard: Lanyard,
    foamboard: Foamboard,
    buttonbadge: ButtonBadge,
    frame: Frame,
    calendar: Calendar,
    sublimationshirt: SublimationShirt,
    totebag: Totebag
  };

  const FormComponent = components[productName.toLowerCase()];

  if (!FormComponent) {
    return <div>Order form not found for: {productName}</div>;
  }

  return <FormComponent subproductId={id} />;
};

export default OrderFormRouter;
