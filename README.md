# RealPrice

# Achieved
1. Periodically check and download RealPrice.xml from OpenData to Storage. Everyday.
2. Transform downloaded RealPrice.sml into Firestore. After downloading a new RealPrice.xml.
3. Periodically geocode address into latitude, longtitude, and formatted address. Every 30 min.

# Plan
1. ~~Backup RealPrice.xml everyday.~~
2. ~~Transform RealPrice.xml to Firestore collections.~~
3. ~~Send exception notification to admin (Me).~~
4. Address to lat lng
   1. ~~geocode items periodically~~
   2. Use previous lat and lng if exist.
5. Add authentication
6. Add admin functions for myself
7. Add frontend Google maps
   1. ~~Add google map~~
   2. Add markers for each item