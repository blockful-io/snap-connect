import os
import binascii

private_key = os.urandom(32)
hex_private_key = binascii.hexlify(private_key).decode('utf-8')
print(f"Private key: {hex_private_key}")
