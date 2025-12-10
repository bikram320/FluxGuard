package org.example.fluxguard.service;

import lombok.AllArgsConstructor;
import org.example.fluxguard.Exceptions.DataNotFoundException;
import org.example.fluxguard.Exceptions.IPBlockedException;
import org.example.fluxguard.repository.BlocksRepository;
import org.springframework.stereotype.Service;

import java.net.InetAddress;

@AllArgsConstructor
@Service
public class BlockIPService {

    private final BlocksRepository blocksRepository;
    public boolean isIpBlocked(InetAddress ipAddress) throws IPBlockedException {
        //checking if IP is blocked or not
        if(ipAddress == null){
            return true;
        }
        if(blocksRepository.existsByIpAddress(ipAddress)){
            return true;
        }
        return false;
    }
}
