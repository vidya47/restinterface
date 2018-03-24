// Devicelist data array for filling in info box
var deviceListData = [];

// DOM Ready =============================================================
$(document).ready(function() {

    // Populate the device table on initial page load
    populateTable();
    // Devicename link click
    $('#deviceList table tbody').on('click', 'td a.linkshowdevice', showDeviceInfo);
    // Add Device button click
    $('#btnAddDevice').on('click', addDevice);
    // Delete Device link click
    $('#deviceList table tbody').on('click', 'td a.linkdeletedevice', deleteDevice);
});

// Functions =============================================================

// Fill table with data
function populateTable() {

    // Empty content string
    var tableContent = '';

    // jQuery AJAX call for JSON
    $.getJSON( '/users/deviceList', function( data ) {
      deviceListData = data;
        // For each item in our JSON, add a table row and cells to the content string
        $.each(data, function(){
            tableContent += '<tr>';
            tableContent += '<td><a href="#" class="linkshowdevice" rel="' + this.deviceName + '">' + this.deviceName + '</a></td>';
            tableContent += '<td>' + this.status + '</td>';

            tableContent += '<td><a href="#" class="linkdeletedevice" rel="' + this._id + '">delete</a></td>';
            tableContent += '</tr>';
        });

        // Inject the whole content string into our existing HTML table
        $('#deviceList table tbody').html(tableContent);
    });
};

// Show Device Info
function showDeviceInfo(event) {

    // Prevent Link from Firing
    event.preventDefault();

    // Retrieve devicename from link rel attribute
    var thisDeviceName = $(this).attr('rel');

    // Get Index of object based on id value
    var arrayPosition = deviceListData.map(function(arrayItem) { return arrayItem.deviceName; }).indexOf(thisDeviceName);

    // Get our User Object
    var thisDeviceObject = deviceListData[arrayPosition];

    //Populate Info Box
    $('#deviceInfoName').text(thisDeviceObject.deviceName);
    $('#deviceInfoModel').text(thisDeviceObject.Model);
    $('#deviceInfoMake').text(thisDeviceObject.Make);
    $('#deviceInfoYear').text(thisDeviceObject.Year);

};

// Add device
function addDevice(event) {
    event.preventDefault();

    // Super basic validation - increase errorCount variable if any fields are blank
    var errorCount = 0;
    $('#addDevice input').each(function(index, val) {
        if($(this).val() === '') { errorCount++; }
    });

    // Check and make sure errorCount's still at zero
    if(errorCount === 0) {

        // If it is, compile all user info into one object
        var newDevice = {
            'deviceName': $('#addDevice fieldset input#inputDeviceName').val(),
            'status': $('#addDevice fieldset input#inputDeviceStatus').val(),
            'Model': $('#addDevice fieldset input#inputDeviceModel').val(),
            'Make': $('#addDevice fieldset input#inputDeviceMake').val(),
            'Year': $('#addDevice fieldset input#inputDeviceYear').val()
        }

        // Use AJAX to post the object to our addDevice service
        $.ajax({
            type: 'POST',
            data: newDevice,
            url: '/users/addDevice',
            dataType: 'JSON'
        }).done(function( response ) {

            // Check for successful (blank) response
            if (response.msg === '') {

                // Clear the form inputs
                $('#addDevice fieldset input').val('');

                // Update the table
                populateTable();

            }
            else {

                // If something goes wrong, alert the error message that our service returned
                alert('Error: ' + response.msg);

            }
        });
    }
    else {
        // If errorCount is more than 0, error out
        alert('Please fill in all fields');
        return false;
    }
};


// Delete Device
function deleteDevice(event) {

    event.preventDefault();

    // Pop up a confirmation dialog
    var confirmation = confirm('Are you sure you want to delete this device?');

    // Check and make sure the user confirmed
    if (confirmation === true) {

        // If they did, do our delete
        $.ajax({
            type: 'DELETE',
            url: '/users/deleteDevice/' + $(this).attr('rel')
        }).done(function( response ) {

            // Check for a successful (blank) response
            if (response.msg === '') {
            }
            else {
                alert('Error: ' + response.msg);
            }

            // Update the table
            populateTable();

        });

    }
    else {

        // If they said no to the confirm, do nothing
        return false;

    }

};
