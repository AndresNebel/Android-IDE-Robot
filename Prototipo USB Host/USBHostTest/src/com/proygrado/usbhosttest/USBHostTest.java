package com.proygrado.usbhosttest;

import java.net.ContentHandler;
import java.util.HashMap;
import java.util.Iterator;

import android.R.string;
import android.hardware.usb.UsbDevice;
import android.hardware.usb.UsbManager;
import android.os.Bundle;
import android.app.Activity;
import android.content.Context;
import android.view.Menu;
import android.view.View;
import android.widget.ArrayAdapter;
import android.widget.EditText;
import android.widget.ListView;
import android.widget.TextView;

public class USBHostTest extends Activity {

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
    
    public void Refresh_OnClick(View view)
    {
    	searchDevices();
    }
    
    
    public void searchDevices()
    {
    	UsbManager manager = (UsbManager) getSystemService(Context.USB_SERVICE);
    	HashMap<String, UsbDevice> deviceList = manager.getDeviceList();
    	Iterator<UsbDevice> deviceIterator = deviceList.values().iterator();
    	ListView listViewDevices = (ListView) findViewById (R.id.listViewDevices);
    	TextView displayLabel = (TextView) findViewById (R.id.textView1);
    	ArrayAdapter<String> adapter = new ArrayAdapter<String>(this, 
    	        android.R.layout.simple_list_item_1);
    	
    	if (!deviceIterator.hasNext())
    	{
    		displayLabel.setText("Shit! no devices");
    	}
    	else
    	{
			while(deviceIterator.hasNext()){
			    UsbDevice device = deviceIterator.next();
			    String deviceStr = "Name: " + device.getDeviceName()
			    		+ " Vendor-Id" +device.getVendorId()
			    		+ " Product-Id" +device.getProductId();
			    adapter.add(deviceStr);
			}
    	}
    	listViewDevices.setAdapter(adapter);
    }
}
