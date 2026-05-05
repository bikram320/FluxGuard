package org.example.fluxguard.converter;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

import java.net.InetAddress;
import java.net.UnknownHostException;

/**
 * Converts InetAddress <-> String for JPA persistence.
 * Without this, Hibernate has no idea how to serialize InetAddress into a VARCHAR column.
 * Apply @Convert(converter = InetAddressConverter.class) on any InetAddress field,
 * or since autoApply = true, it kicks in automatically for all InetAddress fields.
 */
@Converter(autoApply = true)
public class InetAddressConverter implements AttributeConverter<InetAddress, String> {

    @Override
    public String convertToDatabaseColumn(InetAddress attribute) {
        if (attribute == null) return null;
        return attribute.getHostAddress(); // e.g. "192.168.1.1"
    }

    @Override
    public InetAddress convertToEntityAttribute(String dbData) {
        if (dbData == null || dbData.isBlank()) return null;
        try {
            return InetAddress.getByName(dbData);
        } catch (UnknownHostException e) {
            throw new IllegalArgumentException("Invalid IP address stored in DB: " + dbData, e);
        }
    }
}