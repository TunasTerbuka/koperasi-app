package com.koperasichain.states

import net.corda.core.contracts.*
import net.corda.core.identity.Party
import java.time.LocalDate

@CordaSerializable
enum class ResourceCategory { EQUIPMENT, FACILITY, VEHICLE, LAND, OTHER }

@BelongsToContract(ResourceContract::class)
data class ResourceState(
    val name: String,
    val category: ResourceCategory,
    val description: String,
    val availability: Boolean = true,
    val costPerUse: Double = 0.0,
    val location: String?,
    val maintenanceDate: LocalDate?,
    override val participants: List<Party>
) : ContractState
