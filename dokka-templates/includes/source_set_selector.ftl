<#macro display>
    <#if sourceSets??>
        <div class="filter-section" id="filter-section">
            <#list sourceSets as ss>
                {% ktl_component "FilterButton" data-filter="${ss.filter}" children="${ss.name}" %}
            </#list>
        </div>
    </#if>
</#macro>
