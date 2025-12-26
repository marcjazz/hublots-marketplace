import GeolocationService from "./service"
import { Module } from "@medusajs/framework/utils"
import { StoreLocation } from "./models"

export const GEOLOCATION_MODULE = "geolocation"

export default Module(GEOLOCATION_MODULE, {
  service: GeolocationService,
})
