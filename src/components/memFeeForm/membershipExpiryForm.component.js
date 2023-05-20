import React from 'react';
import Alert from 'react-bootstrap/Alert';

export default function MembershipExpiryForm(props) {

    let expirationDate = props.expirationDate;
    let expired = props.expired;
    
    return (
        <div>
            { expired ? (
                <Alert variant='danger'>
                    <Alert.Heading>A taxa de associação do Bagre Movies expirou!</Alert.Heading>
                    A data de renovação foi {expirationDate}
                </Alert> 
            ) : (
                <Alert variant='info'>
                    A data de renovação da taxa de adesão é: <b>{expirationDate}</b>.
                </Alert> 
            )}
        </div>
    )
}