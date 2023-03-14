interface Navigator {
  bluetooth: Bluetooth;
}

interface Bluetooth {
  requestDevice(options?: RequestDeviceOptions): Promise<BluetoothDevice>;
}

interface BluetoothDevice {
  id: string;
  name: string;
  gatt?: BluetoothRemoteGATTServer;
  watchAdvertisements(): any;
  unwatchAdvertisements(): any;
  connectGATT(): Promise<BluetoothRemoteGATTServer>;
}

interface BluetoothRemoteGATTServer {
  device: BluetoothDevice;
  connect(): Promise<void>;
  disconnect(): void;
  getPrimaryService(service: BluetoothServiceUUID): Promise<BluetoothRemoteGATTService>;
}

interface BluetoothRemoteGATTService {
  uuid: string;
  device: BluetoothDevice;
  getCharacteristic(characteristic: BluetoothCharacteristicUUID): Promise<BluetoothRemoteGATTCharacteristic>;
}

interface BluetoothRemoteGATTCharacteristic {
  uuid: string;
  service: BluetoothRemoteGATTService;
  value?: DataView;
  getDescriptor(descriptor: BluetoothDescriptorUUID): Promise<BluetoothRemoteGATTDescriptor>;
  writeValue(value: ArrayBuffer | ArrayBufferView): Promise<void>;
}

interface BluetoothDescriptor {
  uuid: string;
}

type BluetoothServiceUUID = string;
type BluetoothCharacteristicUUID = string;
type BluetoothDescriptorUUID = string;
type RequestDeviceOptions = {
  filters: BluetoothRequestDeviceFilter[];
  optionalServices?: BluetoothServiceUUID[];
};
type BluetoothRequestDeviceFilter = {
  name?: string;
  namePrefix?: string;
  services?: BluetoothServiceUUID[];
};
