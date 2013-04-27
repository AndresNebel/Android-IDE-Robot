package com.proygrado.usbhosttest;

import java.net.ContentHandler;
import java.util.HashMap;
import java.util.Iterator;

import android.hardware.usb.UsbDevice;
import android.hardware.usb.UsbManager;
import android.os.Bundle;
import android.app.Activity;
import android.content.Context;
import android.view.Menu;
import android.widget.EditText;

public class MainActivity extends Activity {

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        searchDevices();
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        getMenuInflater().inflate(R.menu.activity_main, menu);
        return true;
    }
    
    
    public void searchDevices()
    {
    	UsbManager manager = (UsbManager) getSystemService(Context.USB_SERVICE);
    	HashMap<String, UsbDevice> deviceList = manager.getDeviceList();
    	Iterator<UsbDevice> deviceIterator = deviceList.values().iterator();
    	EditText devicesTextField = (EditText) findViewById (R.id.devicesTextField);
    	if (!deviceIterator.hasNext())
    	{
    		devicesTextField.setText("Shit! no devices");
    	}
    	else
    	{
			while(deviceIterator.hasNext()){
			    UsbDevice device = deviceIterator.next();
			    devicesTextField.setText("Name: " + device.getDeviceName()
			    		+ " Vendor-Id" +device.getVendorId()
			    		+ " Product-Id" +device.getProductId());
			}
    	}
    }
}
