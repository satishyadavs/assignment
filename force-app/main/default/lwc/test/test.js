import { LightningElement } from 'lwc';

export default class UserInfo extends LightningElement {
    phoneNumber = '';
    dateOfBirth = '';
    tshirtSize = '';
    shoeSize = '';

    get tshirtOptions() {
        return [
            { label: 'XS', value: 'XS' },
            { label: 'S', value: 'S' },
            { label: 'M', value: 'M' },
            { label: 'L', value: 'L' },
            { label: 'XL', value: 'XL' },
            { label: 'XXL', value: 'XXL' },
        ];
    }

    get shoeOptions() {
        let options = [];
        for (let size = 6; size <= 16; size += 0.5) {
            options.push({ label: size.toString(), value: size.toString() });
        }
        return options;
    }

    handlePhoneNumberChange(event) {
        const input = event.target.value.replace(/\D/g, '');
        if (input.length === 10) {
            this.phoneNumber = input.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
        } else {
            this.phoneNumber = '';
        }
    }

    handleDateOfBirthChange(event) {
        this.dateOfBirth = event.target.value;
    }

    handleTshirtSizeChange(event) {
        this.tshirtSize = event.target.value;
    }

    handleShoeSizeChange(event) {
        this.shoeSize = event.target.value;
    }
}
