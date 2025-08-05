package com.koperasichain.states

import net.corda.core.contracts.*
import net.corda.core.identity.Party
import java.time.LocalDate

@CordaSerializable
enum class ContributionType { MONEY, GOODS, LABOR, LAND }

@BelongsToContract(ContributionContract::class)
data class ContributionState(
    val memberId: String,
    val contributionType: ContributionType,
    val amount: Double,
    val description: String,
    val date: LocalDate,
    val verified: Boolean = false,
    val hash: String?,
    override val participants: List<Party>
) : ContractState
