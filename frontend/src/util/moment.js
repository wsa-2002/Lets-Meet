import Moment from "moment";
import "moment/locale/zh-tw";
import { extendMoment } from "moment-range";
const moment = extendMoment(Moment);

export default (time, format, language, timeFormat = undefined) =>
  moment(time, timeFormat).locale(language).format(format);

export { moment };
