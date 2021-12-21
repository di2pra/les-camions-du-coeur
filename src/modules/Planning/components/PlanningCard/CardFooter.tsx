import  {FC} from 'react';
import { IPlanning } from './../../types';



interface Props {
  distribution: {isProcessing: boolean; data: IPlanning}
}

const CardFooter: FC<Props> = ({distribution}) => {
  return null;
}

export default CardFooter;