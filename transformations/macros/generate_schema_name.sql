{% macro generate_schema_name(custom_schema_name, node) -%}

    {%- if custom_schema_name is none -%}
        {%- if target.schema -%}
            {{ target.schema }}
        {%- else -%}
            public
        {%- endif -%}
    {%- else -%}
        {{ custom_schema_name | trim }}
    {%- endif -%}

{%- endmacro %}

