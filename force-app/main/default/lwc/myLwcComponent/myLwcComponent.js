import { LightningElement, track} from 'lwc';
import {ShowToastEvent} from 'lightning/platformShowToastEvent';
import fetchContactDetails from '@salesforce/apex/TriggerHandler.fetchContactDetails';

import updateContactRecord from '@salesforce/apex/TriggerHandler.updateContactRecord';

const fields = [
    'Contact.Id',
    'Contact.FirstName',
    'Contact.LastName',
    'Contact.Phone',
    'Contact.Email',
    // Add more fields as needed
];

export default class UserInfo extends LightningElement {
    @track recordId='';
    @track encryptedKey='';
    @track contacts;
    @track error=true;
    @track message='';
    @track toastVisible=false;
    

    @track phoneNumber = '';
    @track dateOfBirth = '';
    @track tshirtSize = '';
    @track shoeSize = '';

    phoneTrue=false;
    dateTrue=false;
    tshirtTrue=false;
    shoeTrue=false;
     
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
     

    connectedCallback() {
        // Extract record ID from the URL parameters
        const currentUrl = window.location.href;
        
        const urlParts = currentUrl.split('?');

    // If there are query parameters
    if (urlParts.length > 1) {
        // Split the query parameters by '&' to separate individual parameters
        const queryParams = urlParts[1].split('&');
        console.log('queryParams',queryParams);
        // Search for the 'recordId' parameter
        for (const param of queryParams) {
            const [key, value] = param.split('=');
            
            if (key === 'id') {
                console.log('key',value);
                // Return the value of the 'recordId' parameter
                this.recordId= value;
            }
            if(key ==='key'){
                console.log('encryptedKey',value);
                this.encryptedKey=value;
            }
        }
    }
    
        console.log('Record ID:', this.recordId);
        console.log('currentUrl ID:', currentUrl);
        this.handleLoad();
    }
        
    

    
    get shoeOptions() {
        let options = [];
        for (let size = 6; size <= 16; size += 0.5) {
            options.push({ label: size.toString(), value: size.toString() });
        }
        return options;
    }

   
    handlePhoneChange(event) {
        this.phoneNumber=event.target.value;
        const phone = event.target.value;
        if (!/^(\d{3}-){2}\d{4}$/.test(phone)) {
            event.target.setCustomValidity('Please enter a valid 10-digit US/Canadian phone number (e.g., 123-456-7890)');
        } else {
            event.target.setCustomValidity('');
        }
        event.target.reportValidity();
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

    handleSubmit() {
        // Get the values of phone number, birthdate, tshirt size, and shoe size
        
         console.log('if');
         var inp=this.template.querySelectorAll("lightning-input");


        inp.forEach(function(element){
            if(element.name=='phoneId'){
                if(element.value=='')
                   this.phoneTrue=true;
                this.phoneNumber=element.value;
            }
            if(element.name=='dobId'){
                if(element.value=='')
                    this.dateTrue=true;
                this.dateOfBirth=element.value;
            }
            
            console.log(element.name,element.value);
            console.log('dateTrue',this.dateTrue);
            console.log('phoneTrue',this.phoneTrue);
            console.log('shoetrue',this.shoeTrue);
            console.log('tshirttrue',this.tshirtTrue);
        },this);
        var inp2=this.template.querySelectorAll("lightning-combobox");
        inp2.forEach(function(element){
            if(element.name=='tShirtSize'){
                if(element.value==null)
                    this.tshirtTrue=true
                this.tshirtSize=element.value;
            }
            if(element.name=='shoeSize'){
                if(element.value==null)
                    this.shoeTrue=true;
                this.shoeSize=element.value;
            }
            console.log(element.name,element.value);
        },this);

        console.log('Phone Number:', this.phoneNumber);
        console.log('Date of Birth:', this.dateOfBirth);
        console.log('T-shirt Size:', this.tshirtSize);
        console.log('Shoe Size:', this.shoeSize);
        // Validate if all required fields are filled
        if (this.phoneTrue || this.dateTrue || this.tshirtTrue || this.shoeTrue) {
            // Throw an error if any value is missing
            console.log('All fields are required.');
            this.message='All fields are required.';
            this.toastVisible=true;
            this.phoneTrue=false;
            this.dateTrue=false;
            this.tshirtTrue=false;
            this.shoeTrue=false;
            
            setTimeout(() => { this.toastVisible=false; }, 4000); 
            return;
        }
        console.log('after if');
       

        
        
        console.log('Submitting user information:');
        console.log('Phone Number:', this.phoneNumber);
        console.log('Date of Birth:', this.dateOfBirth);
        console.log('T-shirt Size:', this.tshirtSize);
        console.log('Shoe Size:', this.shoeSize);
        console.log('recordid',this.recordId);
        console.log('this.encryptedKey',this.encryptedKey);
        updateContactRecord({ contactId: this.recordId, newPhoneNumber: this.phoneNumber,encryptedKey:this.encryptedKey,birthDate:this.dateOfBirth,tShirtSize:this.tshirtSize,shoeSize:this.shoeSize })
        .then(result => {
            // Handle success
            this.toastVisible=true;
            console.log('Contact updated successfully');
            this.message='Contact updated successfully';
            const event = new ShowToastEvent({
                title: 'Successfully Updated',
                message: 'Information Updated',
                variant: 'Success'
            });
            this.dispatchEvent(event);
        })
        .catch(error => {
            // Handle error
            console.error('Error updating contact:', error);
        });
        setTimeout(() => { this.toastVisible=false; }, 4000); 
    }

    handleLoad() {
        fetchContactDetails({ contactId: this.recordId,encryptedKey:this.encryptedKey })
          .then((result) => {
            this.contacts = result;
            this.error=false;
            console.log('this.contacts',this.contacts);
            this.contacts.forEach(contact => {
                this.phoneNumber.push(contact.MobilePhone);
                this.tshirtSize.push(contact.TShirtSize__c);
                this.shoeSize.push(contact.ShoeSize__c);
                this.dateOfBirth.push(contact.birthDate);
            });
            
          })
          .catch((error) => {
            this.error = error;
            console.log('this.error',this.error);
          });
      }
      get hasContacts() {
        return this.contacts && this.contacts.length <1;
    }
    
    executeAfterFiveSeconds(){
        this.toastVisible=false;
    }
    
}