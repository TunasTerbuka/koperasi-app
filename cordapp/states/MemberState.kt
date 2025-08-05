package com.koperasichain.states

import net.corda.core.contracts.*
import net.corda.core.identity.Party
import net.corda.core.serialization.CordaSerializable
import java.time.LocalDate

@CordaSerializable
enum class MemberType { FOUNDING, REGULAR, HONORARY }

@BelongsToContract(MemberContract::class)
data class MemberState(
    val fullName: String,
    val villageAddress: String,
    val phoneNumber: String,
    val memberId: String,
    val joinDate: LocalDate?,
    val memberType: MemberType = MemberType.REGULAR,
    val totalContributions: Double = 0.0,
    val activeStatus: Boolean = true,
    override val participants: List<Party>
) : ContractState
