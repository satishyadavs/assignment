import { LightningElement, api } from 'lwc';

export default class Toast extends LightningElement {
    @api message;
    @api duration;

    get toastClass() {
        return 'toast';
    }

    handleCloseClick() {
        
    }
}
