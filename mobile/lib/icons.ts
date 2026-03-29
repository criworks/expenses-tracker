import { cssInterop } from 'nativewind';
import { Feather } from '@expo/vector-icons';
import { 
  BellSimple, 
  CardsThree, 
  Nut, 
  Plus, 
  Check, 
  CaretRight, 
  WarningCircle, 
  PencilSimple 
} from 'phosphor-react-native';

const iconConfig = {
  className: {
    target: "style",
    nativeStyleToProp: {
      color: true,
      opacity: true,
    },
  },
};

// @expo/vector-icons
cssInterop(Feather, iconConfig);

// phosphor-react-native
cssInterop(BellSimple, iconConfig);
cssInterop(CardsThree, iconConfig);
cssInterop(Nut, iconConfig);
cssInterop(Plus, iconConfig);
cssInterop(Check, iconConfig);
cssInterop(CaretRight, iconConfig);
cssInterop(WarningCircle, iconConfig);
cssInterop(PencilSimple, iconConfig);
