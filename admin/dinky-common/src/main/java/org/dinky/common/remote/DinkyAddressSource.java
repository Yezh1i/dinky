package org.dinky.common.remote;

import com.dtflys.forest.callback.AddressSource;
import com.dtflys.forest.http.ForestAddress;
import com.dtflys.forest.http.ForestRequest;

public class DinkyAddressSource implements AddressSource {
    @Override
    public ForestAddress getAddress(ForestRequest request) {

        return new ForestAddress("ip", 80);
    }
}
